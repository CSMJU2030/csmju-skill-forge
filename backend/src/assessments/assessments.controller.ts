import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentAttemptDto } from './dto/create-assessment-attempt.dto';

@Controller('students/me/assessment-attempts')
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Get()
  history(
    @Identity() identity: GatewayIdentity,
    @Query('career_path_id') careerPathId?: string,
  ) {
    return this.service.history(identity, careerPathId);
  }

  @Post()
  create(
    @Identity() identity: GatewayIdentity,
    @Body() dto: CreateAssessmentAttemptDto,
  ) {
    return this.service.createAttempt(identity, dto);
  }
}
