import { Body, Controller, Get, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';
import { SetTargetCareerPathDto } from './dto/set-target-career-path.dto';

// GET /api/v1/students/me
// POST /api/v1/students/me/target-career-path
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get('me')
  getMe(@Identity() identity: GatewayIdentity) {
    return this.service.getOrCreate(identity);
  }

  @Post('me/target-career-path')
  setTarget(@Identity() identity: GatewayIdentity, @Body() dto: SetTargetCareerPathDto) {
    return this.service.setTargetCareerPath(identity, dto.career_path_id);
  }
}
