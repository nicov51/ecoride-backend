import { Ride } from './ride.entity';
import { User } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(() => User)
  reporter: User;

  @ManyToOne(() => Ride)
  ride: Ride;

  @Column({ default: false })
  resolved: boolean;
}
