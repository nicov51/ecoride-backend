import { Module } from '@nestjs/common';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '../../models/participation.entity';
import { User } from '../../models/user.entity';
import { Ride } from '../../models/ride.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participation, User, Ride])],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
