import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateRideDto } from '../../dto/create-ride.dto';
import { RidesService } from './rides.service';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}
  @Post()
  create(@Body() dto: CreateRideDto) {
    return this.ridesService.create(dto);
  }
  @Get()
  findAll() {
    return this.ridesService.findAll();
  }
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.ridesService.findOne(id);
  // }
}
