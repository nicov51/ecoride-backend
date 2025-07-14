import { Body, Controller, Get, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from '../../dto/create-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get()
  findAll() {
    return this.brandService.findAll();
  }
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }
}
