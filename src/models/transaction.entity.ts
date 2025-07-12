import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column('float')
  amount: number;

  @Column()
  type: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  description: string;
}
