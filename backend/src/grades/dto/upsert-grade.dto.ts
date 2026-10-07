import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const VALID_GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'S'];

export class UpsertGradeDto {
  @IsOptional()
  @IsString()
  course_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  course_code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  course_name?: string;

  @IsString()
  @IsIn(VALID_GRADES)
  letter_grade: string;

  @IsString()
  @IsNotEmpty()
  semester: string; // e.g. "2568/1"
}
