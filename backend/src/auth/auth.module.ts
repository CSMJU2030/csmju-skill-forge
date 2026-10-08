import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwksService } from './jwks.service';
import { JwtIdentityMiddleware } from './jwt-identity.middleware';

// @Global so JwksService/JwtIdentityMiddleware are resolvable from AppModule's
// MiddlewareConsumer without every feature module needing to import this one.
@Global()
@Module({
  controllers: [AuthController],
  providers: [JwksService, AuthService, JwtIdentityMiddleware],
  exports: [JwksService, AuthService, JwtIdentityMiddleware],
})
export class AuthModule {}
