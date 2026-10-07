import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { GapAnalysisModule } from '../gap-analysis/gap-analysis.module';

@Module({
  imports: [GapAnalysisModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
