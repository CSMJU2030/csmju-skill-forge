import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { StaffOnlyGuard } from '../common/guards/staff-only.guard';

// GET is open to any authenticated caller (students need to read the catalog).
// POST/PATCH/DELETE are department-only (StaffOnlyGuard) — see that guard's
// comment for why this isn't scoped to an individual username.
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  findAll(@Query('plan_id') planId?: string) {
    return this.service.findAll(planId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneOrThrow(id);
  }

  @Post()
  @UseGuards(StaffOnlyGuard)
  create(@Body() dto: CreateCourseDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(StaffOnlyGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(StaffOnlyGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
