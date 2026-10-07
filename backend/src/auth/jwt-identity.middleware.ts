import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { JwksService } from './jwks.service';
import { GatewayIdentity } from '../common/types/identity';

// Verifies the caller's JWT directly against the Core Hub's JWKS — this is
// the actual mandated auth contract (see the .env Core issued), which differs
// from the "trust these headers, never verify a JWT yourself" note in the
// illustrative blueprint deck. This subsystem still has no login page, no
// password, and no session of its own; it just checks the signature/claims
// on whatever bearer token the Core Hub's SSO already issued the user.
//
// On any failure (missing token, bad signature, expired, wrong issuer/audience)
// this middleware does NOT throw — Express middleware errors bypass Nest's
// exception filters, which would break our Standard Envelope error shape.
// It simply leaves req.identity unset; the @Identity() decorator then raises
// a clean 401 from inside the Nest pipeline, where our filter can format it.
@Injectable()
export class JwtIdentityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtIdentityMiddleware.name);

  constructor(private readonly jwks: JwksService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
      this.applyDevFallbackIfEnabled(req);
      return next();
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks.getKeySet(), {
        issuer: process.env.CORE_HUB_ISSUER,
        audience: process.env.CORE_HUB_AUDIENCE,
        clockTolerance: Number(process.env.JWT_CLOCK_TOLERANCE_SEC ?? 5),
      });
      (req as any).identity = {
        username: payload.username as string,
        layer1Role: payload.layer1_role as GatewayIdentity['layer1Role'],
        faculty: payload.faculty as string,
      } satisfies GatewayIdentity;
    } catch (e) {
      this.logger.warn(`JWT verification failed: ${(e as Error).message}`);
      // req.identity stays unset -> @Identity() will 401
    }
    next();
  }

  // Local-dev convenience only: lets you run this subsystem without a real
  // Core Hub SSO session in front of it. Must be false/unset once this sits
  // behind the real Gateway/Core.
  private applyDevFallbackIfEnabled(req: Request) {
    if (process.env.DEV_IDENTITY_FALLBACK === 'true' && process.env.NODE_ENV !== 'production') {
      (req as any).identity = {
        username: process.env.DEV_USERNAME || '6xxxxxxxxx-dev',
        layer1Role: (process.env.DEV_ROLE as GatewayIdentity['layer1Role']) || 'student',
        faculty: process.env.DEV_FACULTY || 'science',
      } satisfies GatewayIdentity;
    }
  }
}
