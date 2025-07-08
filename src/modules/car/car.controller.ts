import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from '../../dto/create-car.dto';
import { UpdateCarDto } from '../../dto/update-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}
  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }
  @Get()
  findByUser(@Query('userId') userId: number) {
    return this.carService.findAllByUser(userId);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCarDto) {
    return this.carService.update(+id, dto);
  }
  //nest inject @Param et @Query en string donc on converti en number avec +id
  @Delete(':id')
  delete(@Param('id') id: number, @Query('userId') userId: number) {
    return this.carService.delete(+id, +userId);
  }
}
