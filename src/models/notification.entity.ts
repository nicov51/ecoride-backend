// src/models/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { NotificationType } from './notification-type';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.REVIEW_SUBMITTED,
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  relatedId: number; // ID de l'avis concerné

  @Column({ type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
