import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDTO } from '../../dto/create-review.dto';
import { ReviewResponse } from '../../dto/review-response.dto';
import { UpdateReviewStatusDto } from '../../dto/update-review-status.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() dto: CreateReviewDTO,
  ): Promise<ReviewResponse> {
    return this.reviewsService.create(req.user.id, dto);
  }
  @Get()
  async findAll(): Promise<ReviewResponse[]> {
    return this.reviewsService.findAll();
  }
  @Get('pending-problems')
  @UseGuards(JwtAuthGuard)
  async findPendingProblems(): Promise<ReviewResponse[]> {
    return this.reviewsService.findPendingProblems();
  }
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') reviewId: number,
    @Body() dto: UpdateReviewStatusDto,
  ): Promise<ReviewResponse> {
    return this.reviewsService.updateStatus(reviewId, dto);
  }
}
