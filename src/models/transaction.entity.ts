import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Platform } from './platform.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ManyToOne(() => Platform, (platform) => platform.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @Column('float')
  amount: number;

  @Column()
  type: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  description: string;
}
