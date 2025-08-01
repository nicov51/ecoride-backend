import { Brand } from '../models/brand.entity';

export class BrandResponseDto {
  id: number;
  name: string;

  constructor(brand: Brand) {
    this.id = brand.id;
    this.name = brand.name;
  }
}
