// src/models/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  read: boolean;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
