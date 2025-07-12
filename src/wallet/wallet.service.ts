import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../models/wallet.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getWalletByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallet', 'wallet.transactions'],
    });
    if (!user || !user.wallet) {
      throw new NotFoundException(
        'Portefeuille non trouvé pour cet utilisateur',
      );
    }
    return user.wallet;
  }
}
