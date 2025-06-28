import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';
import { CarpoolZone } from './carpool-zone.entity';
import { Participation } from './participation.entity';
import { Review } from './review.entity';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  departureDate: string;

  @Column()
  departurePlace: string;

  @Column({ type: 'date' })
  arrivalDate: string;

  @Column()
  arrivalPlace: string;

  @Column({ type: 'time' })
  departureTime: string;

  @Column({ type: 'time' })
  arrivalTime: string;

  @Column()
  seats: number;

  @Column('float')
  price: number;

  @Column()
  status: string;

  @ManyToOne(() => User)
  driver: User;

  @ManyToOne(() => Car)
  car: Car;

  @ManyToOne(() => CarpoolZone)
  departureZone: CarpoolZone;

  @ManyToOne(() => CarpoolZone)
  arrivalZone: CarpoolZone;

  @OneToMany(() => Participation, (p) => p.ride)
  participations: Participation[];

  @OneToMany(() => Review, (r) => r.ride)
  reviews: Review[];
}
