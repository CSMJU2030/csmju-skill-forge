import { Module } from '@nestjs/common';
import { ProjectIdeasController } from './project-ideas.controller';
import { ProjectIdeasService } from './project-ideas.service';
import { GapAnalysisModule } from '../gap-analysis/gap-analysis.module';

@Module({
  imports: [GapAnalysisModule],
  controllers: [ProjectIdeasController],
  providers: [ProjectIdeasService],
})
export class ProjectIdeasModule {}
