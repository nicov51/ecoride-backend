import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Wallet } from '../../models/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
