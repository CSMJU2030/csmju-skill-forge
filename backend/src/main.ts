// Must be the very first import: NestJS/Prisma/our own services all read
// process.env.* during module init (PrismaService.onModuleInit,
// JwksService.onModuleInit), so .env has to be loaded before AppModule is
// even imported. The Prisma CLI (migrate/generate/studio) auto-loads .env for
// you, which is why those commands "just worked" — the running app doesn't
// get that for free and needs this line.
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // api-conventions.md: all endpoints live under /api/v1, kebab-case, plural nouns.
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Core Rule: Frontend never talks to the database directly, only to this API —
  // CORS is scoped to the subsystem's own frontend origin in production via env.
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN?.split(',') ?? true, credentials: true });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`csmju-skillforge backend listening on :${port} (prefix /api/v1)`);
}
bootstrap();
