import { Ride } from '../models/ride.entity';
import { CarpoolZoneResponseDto } from './carpool-zone-response.dto';
import { CarResponseDto } from './car-response.dto';
import { ParticipationResponseDto } from './participation-response.dto';

export class RideResponseDto {
  participations: ParticipationResponseDto[];
  id: number;
  departureDateTime: Date;
  arrivalDateTime: Date;
  departurePlace: string;
  arrivalPlace: string;
  seats: number;
  price: number;
  status: string;
  participationCount: number;
  driver: {
    id: number;
    name: string;
    picture?: string;
  };
  car: CarResponseDto;
  departureZone: CarpoolZoneResponseDto;
  arrivalZone: CarpoolZoneResponseDto;
  options:
    | {
        petsAllowed?: boolean;
        luggageAllowed?: boolean;
        airConditioning?: boolean;
      }
    | undefined;

  preferences:
    | {
        chat: string;
        smoking: string;
        music: string;
        pets: string;
        other: string;
      }
    | undefined;
  constructor(ride: Ride) {
    this.id = ride.id;
    this.departureDateTime = ride.departureDateTime;
    this.arrivalDateTime = ride.arrivalDateTime;
    this.departurePlace = ride.departurePlace;
    this.arrivalPlace = ride.arrivalPlace;
    this.seats = ride.seats;
    this.price = ride.price;
    this.status = ride.status;
    this.driver = {
      id: ride.driver.id,
      name: ride.driver.name,
      picture: ride.driver.picture
        ? this.bufferToBase64(ride.driver.picture)
        : undefined,
    };
    this.car = new CarResponseDto(ride.car);
    this.departureZone = new CarpoolZoneResponseDto(ride.departureZone);
    this.arrivalZone = new CarpoolZoneResponseDto(ride.arrivalZone);
    this.participationCount = ride.participations?.length ?? 0;
    this.options = ride.options;
    this.preferences = ride.preferences;

    if (ride.participations) {
      this.participations = ride.participations.map(
        (p) => new ParticipationResponseDto(p),
      );
    }
  }
  //on doit convertir le buffer en string
  private bufferToBase64(buffer: Buffer): string {
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  }
}
