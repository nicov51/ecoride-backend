import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../../models/car.entity';
import { User } from '../../models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User])],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
