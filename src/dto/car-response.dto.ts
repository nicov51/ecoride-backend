import { Car } from '../models/car.entity';
import { BrandResponseDto } from './brand-response.dto';

export class CarResponseDto {
  id: number;
  model: string;
  registration: string;
  fuel: string;
  color: string;
  firstRegistration: Date;
  brand?: BrandResponseDto;

  constructor(car: Car) {
    this.id = car.id;
    this.model = car.model;
    this.registration = car.registration;
    this.fuel = car.fuel;
    this.color = car.color;
    this.firstRegistration = car.firstRegistration;
    this.brand = car.brand ? new BrandResponseDto(car.brand) : undefined;
  }
}
