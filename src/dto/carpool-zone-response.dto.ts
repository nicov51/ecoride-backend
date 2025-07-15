import { CarpoolZone } from '../models/carpool-zone.entity';

export class CarpoolZoneResponseDto {
  id: number;
  label: string;
  lat: number;
  lng: number;
  type: string;

  constructor(zone: CarpoolZone) {
    this.id = zone.id;
    this.label = zone.label;
    this.lat = zone.lat;
    this.lng = zone.lng;
    this.type = zone.type;
  }
}
