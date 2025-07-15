import { Ride } from '../models/ride.entity';
import { CarpoolZoneResponseDto } from './carpool-zone-response.dto';

export class RideResponseDto {
  id: number;
  departureDate: Date;
  arrivalDate: Date;
  departureTime: Date;
  arrivalTime: Date;
  departurePlace: string;
  arrivalPlace: string;
  seats: number;
  price: number;
  status: string;
  participationCount: number;
  driverId: number;
  carId: number;
  departureZone: CarpoolZoneResponseDto;
  arrivalZone: CarpoolZoneResponseDto;

  constructor(ride: Ride) {
    this.id = ride.id;
    this.departureDate = ride.departureDate;
    this.arrivalDate = ride.arrivalDate;
    this.departureTime = ride.departureTime;
    this.arrivalTime = ride.arrivalTime;
    this.departurePlace = ride.departurePlace;
    this.arrivalPlace = ride.arrivalPlace;
    this.seats = ride.seats;
    this.price = ride.price;
    this.status = ride.status;
    this.driverId = ride.driver?.id;
    this.carId = ride.car?.id;
    this.departureZone = new CarpoolZoneResponseDto(ride.departureZone);
    this.arrivalZone = new CarpoolZoneResponseDto(ride.arrivalZone);
    this.participationCount = ride.participations?.length ?? 0;
  }
}
