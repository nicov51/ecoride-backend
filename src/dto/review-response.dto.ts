import { Review, ReviewStatus } from '../models/review.entity';

export class ReviewResponse {
  id: number;
  comment: string;
  rating: number;
  status: ReviewStatus;
  isProblem: boolean;
  reason?: string;
  rideId: number;
  userId: number;
  createdAt: Date;

  constructor(review: Review) {
    this.id = review.id;
    this.comment = review.comment;
    this.rating = review.rating;
    this.isProblem = review.isProblem;
    this.reason = review.reason;
    this.rideId = review.ride.id;
    this.userId = review.user.id;
    this.createdAt = review.createdAt;
  }
}
