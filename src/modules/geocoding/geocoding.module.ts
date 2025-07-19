import { Module } from '@nestjs/common';
import { GeocodingController } from './geocoding.controller';
import { HttpModule } from '@nestjs/axios';
import { GeocodingService } from './geocoding.service';

@Module({
  imports: [HttpModule],
  controllers: [GeocodingController],
  providers: [GeocodingService],
})
export class GeocodingModule {}
