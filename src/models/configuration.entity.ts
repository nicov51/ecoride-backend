// src/models/configuration.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Parameter } from './parameter.entity';
import { User } from './user.entity';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Parameter, (param) => param.configuration)
  parameters: Parameter[];

  @ManyToOne(() => User, { nullable: true })
  updated_by: User;
}
