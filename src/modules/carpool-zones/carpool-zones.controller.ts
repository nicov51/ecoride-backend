import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CarpoolZonesService } from './carpool-zones.service';
import { CreateCarpoolZoneDto } from '../../dto/create-carpool-zone.dto';

@Controller('carpool-zones')
export class CarpoolZonesController {
  constructor(private readonly carpoolZoneService: CarpoolZonesService) {}
  @Post()
  create(@Body() dto: CreateCarpoolZoneDto) {
    return this.carpoolZoneService.create(dto);
  }
  @Get()
  findAll() {
    return this.carpoolZoneService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carpoolZoneService.remove(+id);
  }
}
