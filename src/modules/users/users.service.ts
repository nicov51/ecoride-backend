import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
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
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles', 'wallet'],
      order: { id: 'ASC' },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    console.log(`Recherche user par email: ${email}`); // Debug
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['wallet', 'roles'],
    });
    console.log('User trouvé:', user?.roles); // Vérifiez les rôles
    return user;
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
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wallet', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async update(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    const updatedUser = await this.findById(id, {
      relations: ['wallet', 'roles'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}
