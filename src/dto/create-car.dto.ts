import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { FuelType } from '../models/car.entity';

export class CreateCarDto {
  @IsString()
  model: string;

  @IsString()
  registration: string;

  @IsEnum(FuelType)
  fuel: FuelType;

  @IsString()
  color: string;

  @IsDateString()
  firstRegistration: string;

  @IsNotEmpty()
  ownerId: number;
}
