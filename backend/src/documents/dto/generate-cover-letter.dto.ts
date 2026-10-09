import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LlmConfigDto } from './llm-config.dto';

export class GenerateCoverLetterDto {
  @IsString() full_name: string;
  @IsEmail() email: string;
  @IsString() company_name: string;
  @IsOptional() @IsString() target_role?: string;
  @IsOptional() @IsString() hiring_manager_name?: string;
  @IsOptional() @IsString() why_interested?: string; // student's own note on why this company/role
  @IsOptional() @ValidateNested() @Type(() => LlmConfigDto) llm_config?: LlmConfigDto;
}
