import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsString()
  comment: string;

  @IsNotEmpty()
  isProblem: boolean;
}
