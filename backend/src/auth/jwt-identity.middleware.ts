import { ForbiddenException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../common/types/identity';
import { AuthService } from './auth.service';
import { getCookieValue, subsystemCookieName } from './cookies';

@Injectable()
export class JwtIdentityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtIdentityMiddleware.name);

  constructor(private readonly auth: AuthService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const request = req as AuthenticatedRequest;
    const authHeader = req.header('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    const token =
      bearerToken ??
      getCookieValue(req.headers.cookie, subsystemCookieName('access_token'));

    if (!token) {
      return next();
    }

    try {
      request.identity = await this.auth.verifyAccessToken(token);
    } catch (error) {
      request.authFailure =
        error instanceof ForbiddenException ? 'forbidden' : 'unauthorized';
      this.logger.warn('Core Hub access token was rejected.');
    }
    return next();
  }
}
