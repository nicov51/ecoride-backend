import { Module } from '@nestjs/common';
import { CarpoolZonesController } from './carpool-zones.controller';
import { CarpoolZonesService } from './carpool-zones.service';

@Module({
  controllers: [CarpoolZonesController],
  providers: [CarpoolZonesService],
  exports: [CarpoolZonesService],
})
export class CarpoolZonesModule {}
