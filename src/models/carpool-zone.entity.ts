import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CarpoolZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column('double') // pour lat/lng plus précis que float
  lat: number;

  @Column('double')
  lng: number;

  @Column()
  type: 'departure' | 'arrival'; // ou string, mais union permet de typer
}
