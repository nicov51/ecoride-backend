import { Module } from '@nestjs/common';
import { CarpoolZonesController } from './carpool-zones.controller';
import { CarpoolZonesService } from './carpool-zones.service';
import { CarpoolZone } from '../../models/carpool-zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CarpoolZone])],
  controllers: [CarpoolZonesController],
  providers: [CarpoolZonesService],
  exports: [CarpoolZonesService],
})
export class CarpoolZonesModule {}
