import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { SkillWeightDto } from './skill-weight.dto';

const CATEGORIES = ['core', 'major_elective', 'free_elective', 'general_ed'];

export class CreateCourseDto {
  @IsString() code: string;
  @IsString() name_th: string;
  @IsString() name_en: string;

  @IsInt() @Min(0) credits: number;

  @IsIn(CATEGORIES) category: string;

  @IsOptional() @IsString() plan_id?: string;

  // Which skills this course builds, and how much (0-1). Replaces any
  // existing mapping for this course when provided.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillWeightDto)
  skill_weights?: SkillWeightDto[];
}
