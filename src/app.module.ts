import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from './models/models.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarModule } from './modules/car/car.module';
import { WalletModule } from './wallet/wallet.module';
import { RolesModule } from './modules/roles/roles.module';
import { BrandModule } from './modules/brand/brand.module';
import { RidesModule } from './modules/rides/rides.module';
import { CarpoolZonesModule } from './modules/carpool-zones/carpool-zones.module';
import { ParticipationsModule } from './modules/participations/participations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }), // charge .env
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      autoLoadEntities: true,
      synchronize: true, // à désactiver en prod
    }),
    ModelsModule,
    UsersModule,
    AuthModule,
    CarModule,
    WalletModule,
    RolesModule,
    BrandModule,
    RidesModule,
    CarpoolZonesModule,
    ParticipationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
