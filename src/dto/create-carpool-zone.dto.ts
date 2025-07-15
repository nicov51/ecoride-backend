import { IsLatitude, IsLongitude, IsEnum, IsString } from 'class-validator';

export class CreateCarpoolZoneDto {
  @IsString()
  label: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsEnum(['departure', 'arrival'])
  type: 'departure' | 'arrival';
}
