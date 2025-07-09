import {
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRideDto {
  @IsDateString()
  @Type(() => Date)
  departureDate: Date;

  @IsDateString()
  @Type(() => Date)
  arrivalDate: Date;

  @IsDateString() // Format "HH:mm:ss" ou "HH:mm"
  @Type(() => Date)
  departureTime: Date;

  @IsDateString()
  @Type(() => Date)
  arrivalTime: Date;

  @IsString()
  departurePlace: string;

  @IsString()
  arrivalPlace: string;

  @IsInt()
  @IsPositive()
  seats: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  status: string;

  @IsInt()
  driverId: number;

  @IsInt()
  carId: number;

  @IsInt()
  departureZoneId: number;

  @IsInt()
  arrivalZoneId: number;
}
