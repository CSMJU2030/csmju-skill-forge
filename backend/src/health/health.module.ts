import { Module } from '@nestjs/common';
import { ApiHealthController, HealthController } from './health.controller';

@Module({ controllers: [HealthController, ApiHealthController] })
export class HealthModule {}
