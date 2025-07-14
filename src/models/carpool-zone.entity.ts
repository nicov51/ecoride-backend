import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type CarpoolZoneType = 'departure' | 'arrival';

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

  @Column({ type: 'enum', enum: ['departure', 'arrival'] })
  type: CarpoolZoneType;
}
