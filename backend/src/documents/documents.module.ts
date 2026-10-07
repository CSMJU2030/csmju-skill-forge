import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { LlmClient } from './llm.client';
import { GapAnalysisModule } from '../gap-analysis/gap-analysis.module';
import { LlmSettingsService } from './llm-settings.service';

@Module({
  imports: [GapAnalysisModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, LlmClient, LlmSettingsService],
})
export class DocumentsModule {}
