// src/models/parameter.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Configuration } from './configuration.entity';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Configuration, (config) => config.parameters)
  configuration: Configuration;
}
