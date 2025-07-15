import { Module } from '@nestjs/common';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { Ride } from '../../models/ride.entity';
import { CarpoolZone } from '../../models/carpool-zone.entity';
import { Participation } from '../../models/participation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Car } from '../../models/car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride, CarpoolZone, Car, Participation, User]),
  ],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
