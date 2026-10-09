import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class LlmConfigDto {
  @IsUrl({ protocols: ['https'], require_protocol: true, require_tld: true })
  @MaxLength(500)
  base_url: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  model: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  api_key: string;
}
