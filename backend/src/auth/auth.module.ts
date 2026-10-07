import { Global, Module } from '@nestjs/common';
import { JwksService } from './jwks.service';
import { JwtIdentityMiddleware } from './jwt-identity.middleware';

// @Global so JwksService/JwtIdentityMiddleware are resolvable from AppModule's
// MiddlewareConsumer without every feature module needing to import this one.
@Global()
@Module({
  providers: [JwksService, JwtIdentityMiddleware],
  exports: [JwksService, JwtIdentityMiddleware],
})
export class AuthModule {}
