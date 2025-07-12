import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure: string;

  @Column()
  arrival: string;

  @Column({ type: 'datetime' })
  searchDate: Date;

  @Column()
  passengers: number;

  @Column({ type: 'text', nullable: true })
  preferences: string;

  @ManyToOne(() => User, (user) => user.searchHistories)
  user: User;
}
