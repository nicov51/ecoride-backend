import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Platform } from './platform.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @ManyToOne(() => Platform, (platform) => platform.transactions)
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
