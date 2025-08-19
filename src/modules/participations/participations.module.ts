import { Module } from '@nestjs/common';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '../../models/participation.entity';
import { User } from '../../models/user.entity';
import { Ride } from '../../models/ride.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from '../transaction/transaction.module';
import { Platform } from '../../models/platform.entity';
import { Transaction } from 'src/models/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participation,
      User,
      Ride,
      Platform,
      Transaction,
    ]),
    AuthModule,
    TransactionModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
