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
import { RideStatus } from './ride-status.enum';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  departureDateTime: Date;

  @Column()
  departurePlace: string;

  @Column({ type: 'datetime' })
  arrivalDateTime: Date;

  @Column()
  arrivalPlace: string;

  @Column()
  seats: number;

  @Column('float')
  price: number;

  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.PENDING,
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  options?: {
    petsAllowed?: boolean;
    luggageAllowed?: boolean;
    airConditioning?: boolean;
  };

  @Column({ type: 'json', nullable: true })
  preferences?: {
    chat: string;
    smoking: string;
    music: string;
    pets: string;
    other: string;
  };

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
