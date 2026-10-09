import { PartialType } from '@nestjs/mapped-types';
import { UpsertGradeDto } from './upsert-grade.dto';

export class UpdateGradeDto extends PartialType(UpsertGradeDto) {}
