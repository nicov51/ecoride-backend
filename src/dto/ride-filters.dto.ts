import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';

export class RideFiltersDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  seats?: number;

  @IsOptional()
  @IsBoolean()
  electricOnly?: boolean;

  @IsOptional()
  @IsNumber()
  departureZoneId?: number;

  @IsOptional()
  @IsNumber()
  arrivalZoneId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDuration?: number; // en minutes

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minDriverRating?: number;
}
