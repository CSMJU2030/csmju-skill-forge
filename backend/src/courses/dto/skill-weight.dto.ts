import { IsNumber, IsString, Max, Min } from 'class-validator';

export class SkillWeightDto {
  @IsString()
  skill_id: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;
}
