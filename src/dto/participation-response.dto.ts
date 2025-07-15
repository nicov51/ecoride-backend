import { Participation } from '../models/participation.entity';

export class ParticipationResponseDto {
  id: number;
  rideId: number;
  status: string;
  joinedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };

  constructor(participation: Participation) {
    this.id = participation.id;
    this.rideId = participation.ride.id;
    this.status = participation.status;
    this.joinedAt = participation.joinedAt;
    this.user = {
      id: participation.user.id,
      name: participation.user.name,
      email: participation.user.email,
    };
  }
}
