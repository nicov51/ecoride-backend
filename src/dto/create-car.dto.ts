import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { FuelType } from '../models/car.entity';
import { Type } from 'class-transformer';

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
  @Type(() => Date)
  firstRegistration: Date;

  @IsNotEmpty()
  ownerId: number;
}
