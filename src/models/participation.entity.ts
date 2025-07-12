import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Ride } from './ride.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({ type: 'datetime' })
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.participations)
  user: User;

  @ManyToOne(() => Ride, (ride) => ride.participations)
  ride: Ride;
}
