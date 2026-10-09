import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { decodeProtectedHeader, jwtVerify } from 'jose';
import { CORE_ROLE_TO_SUBSYSTEM_ROLE } from '../common/types/identity';
import type { CoreRole, GatewayIdentity } from '../common/types/identity';
import { JwksService } from './jwks.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwks: JwksService) {}

  beginLogin(next?: string) {
    const safeNext = this.validateNext(next) ? next : '/dashboard';
    const state = randomBytes(32).toString('base64url');
    const stateCookie = `${state}.${Buffer.from(safeNext).toString('base64url')}`;
    const authorizeUrl = new URL('/sso/authorize', this.getCoreHubWebUrl());
    authorizeUrl.searchParams.set('subsystem', this.getSubsystemId());
    authorizeUrl.searchParams.set('state', state);

    return { state, stateCookie, redirectUrl: authorizeUrl.toString() };
  }

  async completeCallback(accessToken: string, state: string, stateCookie: string | undefined) {
    if (!stateCookie) {
      throw new UnauthorizedException('SSO state is missing or invalid.');
    }
    const separator = stateCookie.indexOf('.');
    if (separator < 1 || separator === stateCookie.length - 1) {
      throw new UnauthorizedException('SSO state is missing or invalid.');
    }

    const expectedState = stateCookie.slice(0, separator);
    const actual = Buffer.from(state);
    const expected = Buffer.from(expectedState);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      throw new UnauthorizedException('SSO state is missing or invalid.');
    }

    const encodedNext = stateCookie.slice(separator + 1);
    let next: string;
    try {
      next = Buffer.from(encodedNext, 'base64url').toString('utf8');
    } catch {
      throw new UnauthorizedException('SSO state is missing or invalid.');
    }
    if (!this.validateNext(next)) {
      throw new UnauthorizedException('SSO state is missing or invalid.');
    }

    const identity = await this.verifyAccessToken(accessToken);
    return { identity, next };
  }

  async verifyAccessToken(token: string): Promise<GatewayIdentity> {
    let header: ReturnType<typeof decodeProtectedHeader>;
    try {
      header = decodeProtectedHeader(token);
    } catch {
      throw new UnauthorizedException('Invalid Core Hub access token.');
    }
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) {
      throw new UnauthorizedException('Invalid Core Hub access token.');
    }

    let payload;
    try {
      const verified = await jwtVerify(token, this.jwks.getKeySet(), {
        issuer: process.env.CORE_HUB_ISSUER,
        audience: process.env.CORE_HUB_AUDIENCE,
        algorithms: ['RS256'],
        clockTolerance: 60,
      });
      payload = verified.payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired Core Hub access token.');
    }

    const now = Math.floor(Date.now() / 1000);
    if (
      typeof payload.sub !== 'string' ||
      payload.sub.trim().length === 0 ||
      payload.sub.length > 64 ||
      !Number.isInteger(payload.iat) ||
      !Number.isInteger(payload.exp) ||
      payload.iat! > now + 60 ||
      payload.exp! <= now ||
      payload.exp! - payload.iat! > 960
    ) {
      throw new UnauthorizedException('Invalid Core Hub access token.');
    }

    const subsystemId = this.getSubsystemId();
    if (payload.azp !== undefined && payload.azp !== subsystemId) {
      throw new UnauthorizedException('Access token was issued for another subsystem.');
    }

    const coreRole = payload.role;
    if (typeof coreRole !== 'string' || coreRole.length === 0) {
      throw new UnauthorizedException('Core Hub access token is missing a role.');
    }
    if (!Object.prototype.hasOwnProperty.call(CORE_ROLE_TO_SUBSYSTEM_ROLE, coreRole)) {
      throw new ForbiddenException('This Core Hub role is not enabled for SkillForge.');
    }

    return {
      coreUserId: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      layer1Role: coreRole as CoreRole,
      subsystemRole: CORE_ROLE_TO_SUBSYSTEM_ROLE[coreRole as CoreRole],
      expiresAt: new Date(payload.exp! * 1000).toISOString(),
      expiresAtEpoch: payload.exp!,
    };
  }

  validateNext(value: string | undefined): value is string {
    if (
      typeof value !== 'string' ||
      value.length < 1 ||
      value.length > 512 ||
      !value.startsWith('/') ||
      value.startsWith('//') ||
      value.includes('\\') ||
      /[\u0000-\u001f\u007f]/.test(value)
    ) {
      return false;
    }

    try {
      const parsed = new URL(value, 'http://skillforge.local');
      return (
        parsed.origin === 'http://skillforge.local' &&
        parsed.pathname !== '/auth' &&
        !parsed.pathname.startsWith('/auth/')
      );
    } catch {
      return false;
    }
  }

  getCoreHubWebUrl(): string {
    const value = process.env.CORE_HUB_WEB_URL;
    if (!value) throw new Error('CORE_HUB_WEB_URL must be configured.');
    return value;
  }

  getSubsystemId(): string {
    const value = process.env.SUBSYSTEM_ID;
    if (!value) throw new Error('SUBSYSTEM_ID must be configured.');
    return value;
  }
}
