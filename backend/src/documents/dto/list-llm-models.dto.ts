import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class ListLlmModelsDto {
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true, require_tld: true })
  @MaxLength(500)
  base_url?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  api_key?: string;
}
