import { Controller, Get } from '@nestjs/common';
import { GapAnalysisService } from './gap-analysis.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';

// GET /api/v1/students/me/skill-gap-analysis
// GET /api/v1/students/me/roadmap
@Controller('students/me')
export class GapAnalysisController {
  constructor(private readonly service: GapAnalysisService) {}

  @Get('skill-gap-analysis')
  gap(@Identity() identity: GatewayIdentity) {
    return this.service.computeSkillGap(identity);
  }

  @Get('roadmap')
  roadmap(@Identity() identity: GatewayIdentity) {
    return this.service.buildRoadmap(identity);
  }
}
