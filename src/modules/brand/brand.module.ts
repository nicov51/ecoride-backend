import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../../models/brand.entity';

@Module({
  providers: [BrandService],
  controllers: [BrandController],
  imports: [TypeOrmModule.forFeature([Brand])],
  exports: [BrandService],
})
export class BrandModule {}
