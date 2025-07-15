import { IsInt } from 'class-validator';

export class CreateParticipationDto {
  @IsInt()
  userId: number;

  @IsInt()
  rideId: number;
}
