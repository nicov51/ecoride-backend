import { ReviewStatus } from '../models/review.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateReviewStatusDto {
  @IsEnum(ReviewStatus)
  @IsNotEmpty()
  status: ReviewStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
