import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../models/wallet.entity';
import { Platform } from '../../models/platform.entity';
import { Transaction } from '../../models/transaction.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    //Recupere wallet de la platform
    const wallet = await this.walletRepository.findOne({
      where: { id: dto.walletId },
      relations: ['user'],
    });

    const platform = await this.platformRepository.findOne({
      where: { id: 1 },
      relations: ['wallet'],
    });
    if (!wallet) throw new NotFoundException('Wallet non trouvé');
    if (!platform?.wallet) {
      throw new NotFoundException('Le compte de la plateforme non trouvé');
    }
    const transaction = this.transactionRepository.create({
      wallet: { id: wallet.id },
      platform: { id: platform.id },
      amount: dto.amount,
      type: dto.type,
      date: new Date(),
      description: dto.description,
    });
    // 3. Sauvegarde
    return this.transactionRepository.save(transaction);
  }
}
