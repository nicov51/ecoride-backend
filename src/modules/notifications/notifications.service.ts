import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from '../../models/notification-type';
import { Notification } from '../../models/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async notifyDriverOfNewReview(
    driverId: number,
    reviewId: number,
    rideTitle: string,
  ): Promise<void> {
    const message = `Un avis a été déposé sur votre trajet "${rideTitle}"`;

    await this.notificationsRepository.save({
      userId: driverId,
      message,
      type: NotificationType.REVIEW_SUBMITTED,
      relatedId: reviewId,
    });
  }

  // Notifier l'auteur que son avis a été validé
  async notifyReviewApproved(userId: number, reviewId: number): Promise<void> {
    const message = 'Votre avis a été validé et publié !';

    await this.notificationsRepository.save({
      userId,
      message,
      type: NotificationType.REVIEW_APPROVED,
      relatedId: reviewId,
    });
  }

  // Notifier l'auteur que son avis a été rejeté
  async notifyReviewRejected(
    userId: number,
    reviewId: number,
    reason?: string,
  ): Promise<void> {
    const message = reason
      ? `Votre avis a été rejeté : ${reason}`
      : 'Votre avis a été rejeté par la modération';

    await this.notificationsRepository.save({
      userId,
      message,
      type: NotificationType.REVIEW_REJECTED,
      relatedId: reviewId,
    });
  }

  // Récupérer les notifications d'un user
  async getUserNotifications(userId: number) {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async notifyRideStarted(
    userId: number,
    rideTitle: string,
    rideId: number,
  ): Promise<void> {
    const message = `Votre trajet "${rideTitle}" a démarré !`;

    await this.notificationsRepository.save({
      userId,
      message,
      type: NotificationType.RIDE_STARTED,
      relatedId: rideId,
    });
  }

  // Marquer comme lu
  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationsRepository.update(notificationId, { isRead: true });
  }
}
