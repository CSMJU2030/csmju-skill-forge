import { IsString, IsNotEmpty } from 'class-validator';

export class SetTargetCareerPathDto {
  @IsString()
  @IsNotEmpty()
  career_path_id: string;
}
