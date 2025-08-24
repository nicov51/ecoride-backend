import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RgpdRequestDto {
  @IsEmail()
  email: string;

  @IsIn(['access', 'rectification', 'erasure', 'portability', 'opposition'])
  requestType:
    | 'access'
    | 'rectification'
    | 'erasure'
    | 'portability'
    | 'opposition';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
