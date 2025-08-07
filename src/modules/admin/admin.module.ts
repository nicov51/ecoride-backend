import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Ride } from '../../models/ride.entity';
import { Platform } from '../../models/platform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { Role } from '../../models/role.entity';
import { User } from '../../models/user.entity';
import { Wallet } from '../../models/wallet.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, Platform, Role, User, Wallet])],
  controllers: [AdminController],
  providers: [AdminService, RolesService, UsersService, JwtService],
})
export class AdminModule {}
