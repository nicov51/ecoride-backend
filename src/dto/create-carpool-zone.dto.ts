import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateCarpoolZoneDto {
  @IsString()
  label: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
