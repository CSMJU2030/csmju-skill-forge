import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateAssessmentAttemptDto {
  @IsUUID()
  career_path_id: string;

  @IsInt()
  @Min(0)
  @Max(20)
  score: number;

  @IsInt()
  @Min(10)
  @Max(20)
  total_questions: number;
}
