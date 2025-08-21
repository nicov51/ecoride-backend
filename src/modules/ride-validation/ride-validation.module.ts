import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideValidationController } from './ride-validation.controller';
import { RideValidationService } from './ride-validation.service';
import { Participation } from '../../models/participation.entity';
import { AuthModule } from '../auth/auth.module';
import { Ride } from '../../models/ride.entity';
import { User } from '../../models/user.entity';
import { Platform } from '../../models/platform.entity';
import { Transaction } from '../../models/transaction.entity';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participation,
      Ride,
      User,
      Platform,
      Transaction,
    ]),
    AuthModule,
    ReviewsModule,
  ],
  controllers: [RideValidationController],
  providers: [RideValidationService],
  exports: [RideValidationService],
})
export class RideValidationModule {}
