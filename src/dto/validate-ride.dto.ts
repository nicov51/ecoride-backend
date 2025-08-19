import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { CreateReviewDTO } from './create-review.dto';
import { Type } from 'class-transformer';

export class ValidateRideDto {
  @IsBoolean()
  isSuccessful: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateReviewDTO)
  review?: CreateReviewDTO;
}
