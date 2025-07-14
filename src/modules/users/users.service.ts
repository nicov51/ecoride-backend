import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../dto/register.dto';
import { Wallet } from '../../models/wallet.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly rolesService: RolesService,
  ) {}

  //Todo verif si l'email existe deja
  async create(data: RegisterDto): Promise<User> {
    // Créer l'utilisateur sans role
    const user = this.userRepository.create({
      ...data,
      password: data.password,
      picture: undefined,
    });
    await this.userRepository.save(user);
    // Assigner le rôle Passenger
    await this.rolesService.addRoleToUser(user.id, 'Passenger');
    // Puis créer le wallet avec la référence user
    const wallet = this.walletRepository.create({
      balance: 20,
      createdAt: new Date(),
      user: user, // Établit la relation
    });
    await this.walletRepository.save(wallet);

    // Met à jour la référence dans user
    user.wallet = wallet;
    await this.userRepository.save(user);

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['wallet', 'roles'], // Optionnel: charge automatiquement la relation wallet
    });
  }

  async findById(
    id: number,
    options?: { relations?: string[] },
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }
}
