import { Controller, Get, Param } from '@nestjs/common';
import { CareerPathsService } from './career-paths.service';

// GET /api/v1/career-paths, GET /api/v1/career-paths/:id
@Controller('career-paths')
export class CareerPathsController {
  constructor(private readonly service: CareerPathsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
