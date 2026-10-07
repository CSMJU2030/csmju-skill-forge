import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaveLlmSettingsDto {
  @IsUrl({ protocols: ['https'], require_protocol: true, require_tld: true })
  @MaxLength(500)
  base_url: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  model: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  api_key?: string;

  @IsIn(['until_deleted', 'days'])
  retention_mode: 'until_deleted' | 'days';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  retention_days?: number;
}
