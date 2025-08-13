import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Wallet, (wallet) => wallet.platform)
  @JoinColumn()
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.platform)
  transactions: Transaction[];
}
