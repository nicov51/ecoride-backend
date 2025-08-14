import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review, ReviewStatus } from '../../models/review.entity';
import { Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { Ride } from '../../models/ride.entity';
import { ReviewResponse } from '../../dto/review-response.dto';
import { UpdateReviewStatusDto } from '../../dto/update-review-status.dto';
import { CreateReviewDTO } from '../../dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ride)
    private readonly ridesRepository: Repository<Ride>,
  ) {}

  async create(userId: number, dto: CreateReviewDTO): Promise<ReviewResponse> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const ride = await this.ridesRepository.findOne({
      where: { id: dto.rideId },
      relations: ['participations', 'participations.user'],
    });
    if (!ride) throw new NotFoundException('Trajet non trouvé');

    //verif que l'utilisateur a bien participé au trajet
    const hasParticipated = ride.participations.some(
      (participation) => participation.user.id === userId,
    );
    if (!hasParticipated) {
      throw new NotFoundException(
        'Vous devez avoir participé a un trajet pour laisser un avis',
      );
    }
    // On crée l'avis ou le signalement
    const review = this.reviewsRepository.create({
      ...dto,
      user,
      ride,
      status: ReviewStatus.PENDING,
    });
    //Maj du trajet si c'est un signalement
    if (dto.isProblem) {
      ride.isReported = true;
      await this.ridesRepository.save(ride);
    }
    const savedReview = await this.reviewsRepository.save(review);
    return new ReviewResponse(savedReview);
  }

  async findAll(): Promise<ReviewResponse[]> {
    const reviews = await this.reviewsRepository.find({
      relations: ['user', 'ride'],
      order: { createdAt: 'DESC' },
    });
    return reviews.map((r) => new ReviewResponse(r));
  }

  async findPendingProblems(): Promise<ReviewResponse[]> {
    const reviews = await this.reviewsRepository.find({
      where: {
        isProblem: true,
        status: ReviewStatus.PENDING,
      },
      relations: ['user', 'ride'],
    });
    // on converti l'entité review en dto
    return reviews.map((r) => new ReviewResponse(r));
  }

  async updateStatus(
    reviewId: number,
    dto: UpdateReviewStatusDto,
  ): Promise<ReviewResponse> {
    // on recup l'avis
    const review = await this.reviewsRepository.findOneBy({ id: reviewId });
    if (!review) throw new NotFoundException('avis non trouvé');

    // on met a jour le status
    review.status = dto.status;

    // on ajoute la raison en cas de rejet
    if (dto.status === ReviewStatus.REJECTED && dto.reason) {
      review.reason = dto.reason;
    }
    //on pourrait maj isReported si + de pb en attente

    const updatedReview = await this.reviewsRepository.save(review);
    return new ReviewResponse(updatedReview);
  }
}
