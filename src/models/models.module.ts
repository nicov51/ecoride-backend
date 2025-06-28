// src/models/models.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 📦 Importe ici toutes tes entités
import { Car } from './car.entity';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { CarpoolZone } from './carpool-zone.entity';
import { Configuration } from './configuration.entity';
import { Notification } from './notification.entity';
import { Parameter } from './parameter.entity';
import { Participation } from './participation.entity';
import { Platform } from './platform.entity';
import { Review } from './review.entity';
import { Ride } from './ride.entity';
import { Role } from './role.entity';
import { SearchHistory } from './search-history.entity';
import { Transaction } from './transaction.entity';
import { Wallet } from './wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Car,
      User,
      Brand,
      CarpoolZone,
      Configuration,
      Notification,
      Parameter,
      Participation,
      Platform,
      Review,
      Ride,
      Role,
      SearchHistory,
      Transaction,
      Wallet,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ModelsModule {}
