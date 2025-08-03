import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CreateRideDto } from '../../dto/create-ride.dto';
import { RidesService } from './rides.service';
import { RideFiltersDto } from '../../dto/ride-filters.dto';
import { RideResponseDto } from '../../dto/ride-response.dto';
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
  // Todo activer les guards pour injecter req.user
  @Get('by-user')
  async findByUser(
    @Query('userId') userId: string,
  ): Promise<RideResponseDto[]> {
    const rides = await this.ridesService.findMyRides(+userId);
    return rides.map((ride) => new RideResponseDto(ride));
  }
  @Get('search')
  async search(@Query() filters: RideFiltersDto) {
    return this.ridesService.searchRides(filters);
  }
  // @Get('last-preferences')
  // async getLastPreferences(@Req() req: Request) {
  //   return this.ridesService.getLastRidePreferences(req.user.id);
  // }
}
