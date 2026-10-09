import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { LlmConfigDto } from './llm-config.dto';

export class GenerateResumeDto {
  @IsString() full_name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() target_role?: string; // defaults to the student's target career path
  @IsOptional() @IsArray() highlights?: string[]; // free-text achievements/experience the student wants included
  @IsOptional() @ValidateNested() @Type(() => LlmConfigDto) llm_config?: LlmConfigDto;
}
