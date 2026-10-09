import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LlmConfigDto } from './llm-config.dto';

export class GeneratePortfolioDto {
  @IsString() full_name: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsArray() project_titles?: string[]; // projects to feature; defaults to recommended ones
  @IsOptional() @ValidateNested() @Type(() => LlmConfigDto) llm_config?: LlmConfigDto;
}
