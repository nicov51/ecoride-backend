import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Wallet } from './wallet.entity';
import { Notification } from './notification.entity';
import { Car } from './car.entity';
import { Participation } from './participation.entity';
import { Review } from './review.entity';
import { SearchHistory } from './search-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'blob', nullable: true })
  picture: Buffer;

  @Column()
  pseudo: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];

  @OneToMany(() => Participation, (p) => p.user)
  participations: Participation[];

  @OneToMany(() => Review, (r) => r.user)
  reviews: Review[];

  @OneToMany(() => SearchHistory, (sh) => sh.user)
  searchHistories: SearchHistory[];
}
