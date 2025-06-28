import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Brand } from './brand.entity';

export enum FuelType {
  ELECTRIC = 'ELECTRIC',
  DIESEL = 'DIESEL',
  GASOLINE = 'GASOLINE',
}

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  registration: string;

  @Column({ type: 'enum', enum: FuelType })
  fuel: FuelType;

  @Column()
  color: string;

  @Column({ type: 'date' })
  firstRegistration: string;

  @ManyToOne(() => Brand, (brand) => brand.cars)
  brand: Brand;

  @ManyToOne(() => User, (user) => user.cars)
  owner: User;
}
