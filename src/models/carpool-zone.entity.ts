import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CarpoolZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;
}
