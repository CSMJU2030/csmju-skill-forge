import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';

// GET /api/v1/skills
@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
