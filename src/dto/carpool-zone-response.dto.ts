import { Expose } from 'class-transformer';

export class CarpoolZoneResponseDto {
  @Expose()
  id: number;

  @Expose()
  label: string;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  type: string;
}
