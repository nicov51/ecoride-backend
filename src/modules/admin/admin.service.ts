import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../../models/ride.entity';
import { RolesService } from '../roles/roles.service';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { UsersService } from '../users/users.service';
import { Platform } from '../../models/platform.entity';
import { User } from '../../models/user.entity';
import { Wallet } from '../../models/wallet.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}
  async createEmployee(dto: CreateEmployeeDto) {
    const employee = await this.usersService.create({
      ...dto,
      isVerified: true,
    });
    await this.rolesService.addRoleToUser(employee.id, 'Employee');
    return employee;
  }

  async getRideStatistics() {
    // Retourne les données pour le graphique
    return this.rideRepository
      .createQueryBuilder('ride')
      .select('DATE(ride.departureDateTime)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .getRawMany();
  }

  async getCreditStatistics() {
    return this.platformRepository
      .createQueryBuilder('platform')
      .leftJoinAndSelect('platform.wallet', 'wallet')
      .leftJoinAndSelect('wallet.transactions', 'transactions')
      .select('DATE(transactions.date)', 'date')
      .addSelect('SUM(transactions.amount)', 'total')
      .groupBy('date')
      .getRawMany();
  }

  async getTotalCredits(): Promise<number> {
    // D'abord essayer de trouver la plateforme existante
    const platform = await this.platformRepository.findOne({
      relations: ['wallet'],
      where: { name: 'EcoRide' }, // Ajout d'un critère spécifique
    });

    if (platform) {
      return platform.wallet?.balance || 0;
    }

    // Création seulement si elle n'existe pas
    const newWallet = this.walletRepository.create({
      balance: 0,
      createdAt: new Date(),
    });
    await this.walletRepository.save(newWallet);

    const newPlatform = this.platformRepository.create({
      name: 'EcoRide',
      wallet: newWallet,
    });
    await this.platformRepository.save(newPlatform);

    return 0;
  }

  async suspendUser(userId: number): Promise<User> {
    // Logique de suspension
    const user = await this.usersService.findOne(userId);

    if (user.roles.some((role) => role.label === 'Admin')) {
      throw new ForbiddenException('Cannot suspend an admin');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('User is already suspended');
    }
    return this.usersService.update(userId, {
      isSuspended: true,
      suspendedAt: new Date(),
    });
  }
  async unsuspendUser(userId: number): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user.isSuspended) {
      throw new ForbiddenException('User is not suspended');
    }
    return this.usersService.update(userId, {
      isSuspended: false,
      suspendedAt: null,
    });
  }
}
