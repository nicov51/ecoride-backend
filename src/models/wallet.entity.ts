import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  balance: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}
