import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GradesService } from './grades.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';
import { UpsertGradeDto } from './dto/upsert-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

// GET /api/v1/students/me/grades
// POST /api/v1/students/me/grades   (manual entry or import-row-at-a-time)
// PATCH/DELETE /api/v1/students/me/grades/:id
@Controller('students/me/grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Get()
  findMine(@Identity() identity: GatewayIdentity) {
    return this.service.findMine(identity);
  }

  @Post()
  upsert(@Identity() identity: GatewayIdentity, @Body() dto: UpsertGradeDto) {
    return this.service.upsert(identity, dto);
  }

  @Patch(':id')
  update(
    @Identity() identity: GatewayIdentity,
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.service.update(identity, id, dto);
  }

  @Delete(':id')
  remove(@Identity() identity: GatewayIdentity, @Param('id') id: string) {
    return this.service.remove(identity, id);
  }
}
