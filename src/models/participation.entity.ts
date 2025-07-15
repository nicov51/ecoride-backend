import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Ride } from './ride.entity';

export enum ParticipationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  status: ParticipationStatus;

  @Column({ type: 'datetime' })
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.participations)
  user: User;

  @ManyToOne(() => Ride, (ride) => ride.participations)
  ride: Ride;
}
