import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GatewayIdentity } from '../types/identity';

// Injects the caller's identity into a controller method, e.g.:
//   findMine(@Identity() identity: GatewayIdentity) { ... }
// Throws if the Gateway headers are missing — this subsystem has no login page of
// its own, so a missing identity means the request never went through the Gateway.
export const Identity = createParamDecorator((_data: unknown, ctx: ExecutionContext): GatewayIdentity => {
  const req = ctx.switchToHttp().getRequest();
  const identity = req.identity as GatewayIdentity | undefined;
  if (!identity) {
    throw new UnauthorizedException(
      'Missing or invalid Authorization token. Requests must carry a valid Core Hub JWT (Authorization: Bearer <token>).',
    );
  }
  return identity;
});
