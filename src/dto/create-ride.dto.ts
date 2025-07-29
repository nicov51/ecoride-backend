import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RideStatus } from '../models/ride-status.enum';

export class CreateRideDto {
  @IsDateString() // Format "HH:mm:ss" ou "HH:mm"
  @Type(() => Date)
  departureDateTime: Date;

  @IsDateString()
  @Type(() => Date)
  arrivalDateTime: Date;

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

  @IsEnum(RideStatus)
  status: RideStatus;

  @IsInt()
  driverId: number;

  @IsInt()
  carId: number;

  @IsInt()
  departureZoneId: number;

  @IsInt()
  arrivalZoneId: number;

  @IsOptional()
  @IsObject()
  options?: {
    petsAllowed?: boolean;
    luggageAllowed?: boolean;
    airConditioning?: boolean;
  };

  @IsOptional()
  @IsObject()
  preferences?: {
    chat: string;
    smoking: string;
    music: string;
    pets: string;
    other: string;
  };
}
