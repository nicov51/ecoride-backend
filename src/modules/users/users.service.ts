import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../dto/register.dto';
import { Wallet } from '../../models/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  //Todo verif si l'email existe deja
  async create(data: RegisterDto): Promise<User> {
    const saltRounds = 9;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Créer l'utilisateur d'abord
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      picture: undefined,
    });
    await this.userRepository.save(user);

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
      relations: ['wallet'], // Optionnel: charge automatiquement la relation wallet
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
