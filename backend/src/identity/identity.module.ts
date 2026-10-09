import { Module } from '@nestjs/common';
import { IdentityController, MeController } from './identity.controller';

@Module({ controllers: [IdentityController, MeController] })
export class IdentityModule {}
