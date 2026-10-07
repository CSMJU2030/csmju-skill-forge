import { Controller, Get, Query } from '@nestjs/common';
import { ProjectIdeasService } from './project-ideas.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';

// GET /api/v1/project-ideas?skill_id=
// GET /api/v1/students/me/project-recommendations
@Controller()
export class ProjectIdeasController {
  constructor(private readonly service: ProjectIdeasService) {}

  @Get('project-ideas')
  findAll(@Query('skill_id') skillId?: string) {
    return this.service.findAll(skillId);
  }

  @Get('students/me/project-recommendations')
  recommended(@Identity() identity: GatewayIdentity) {
    return this.service.recommendedForMe(identity);
  }
}
