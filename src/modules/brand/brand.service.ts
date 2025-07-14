import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../models/brand.entity';
import { CreateBrandDto } from '../../dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }
  create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }
  async findOne(id: number): Promise<Brand | null> {
    return this.brandRepository.findOneBy({ id });
  }
}
