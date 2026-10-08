import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest, GatewayIdentity } from '../types/identity';

export const Identity = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): GatewayIdentity => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.authFailure === 'forbidden') {
      throw new ForbiddenException('This Core Hub role is not enabled for SkillForge.');
    }
    if (!request.identity) {
      throw new UnauthorizedException('Missing or invalid Core Hub access token.');
    }
    return request.identity;
  },
);
