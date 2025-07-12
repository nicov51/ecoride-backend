import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../models/wallet.entity';
import { User } from '../models/user.entity';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User]), UsersModule, AuthModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
