import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './identity/identity.module';
import { CareerPathsModule } from './career-paths/career-paths.module';
import { CoursesModule } from './courses/courses.module';
import { SkillsModule } from './skills/skills.module';
import { StudentsModule } from './students/students.module';
import { GradesModule } from './grades/grades.module';
import { GapAnalysisModule } from './gap-analysis/gap-analysis.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ProjectIdeasModule } from './project-ideas/project-ideas.module';
import { DocumentsModule } from './documents/documents.module';
import { AssessmentsModule } from './assessments/assessments.module';

import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtIdentityMiddleware } from './auth/jwt-identity.middleware';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    HealthModule,
    IdentityModule,
    CareerPathsModule,
    CoursesModule,
    SkillsModule,
    StudentsModule,
    GradesModule,
    GapAnalysisModule,
    CertificatesModule,
    ProjectIdeasModule,
    DocumentsModule,
    AssessmentsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseEnvelopeInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applied to every route except /health, which must stay reachable with no
    // identity at all so the Core/orchestrator can always poll it.
    consumer.apply(JwtIdentityMiddleware).exclude('health').forRoutes('*');
  }
}
