import { forwardRef, Module } from '@nestjs/common';
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
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride, Platform, Role, User, Wallet]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminController],
  providers: [AdminService, RolesService, UsersService],
})
export class AdminModule {}
