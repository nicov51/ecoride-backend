import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDTO } from '../../dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participation } from '../../models/participation.entity';
import { DataSource, Repository } from 'typeorm';
import { Ride } from '../../models/ride.entity';
import { User } from '../../models/user.entity';
import { Platform } from '../../models/platform.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { Transaction } from '../../models/transaction.entity';

@Injectable()
export class RideValidationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepo: Repository<Participation>,
    @InjectRepository(Ride)
    private rideRepo: Repository<Ride>,
    @InjectRepository(User)
    @InjectRepository(Platform)
    private transactionRepo: Repository<Transaction>,
    private reviewsService: ReviewsService,
    private dataSource: DataSource,
  ) {}
  async validateRideByParticipant(
    rideId: number,
    userId: number,
    isSuccessful: boolean,
    review?: CreateReviewDTO,
  ): Promise<void> {
    const participation = await this.participationRepo.findOne({
      where: { ride: { id: rideId }, user: { id: userId } },
      relations: ['ride', 'user'],
    });

    if (!participation)
      throw new NotFoundException('Participation non trouvée');

    // Marquer comme validé par ce participant
    participation.validatedAt = new Date();
    participation.validationSuccess = isSuccessful;
    await this.participationRepo.save(participation);

    // Si problème, créer le review avec isProblem=true
    if (!isSuccessful && review) {
      await this.reviewsService.create(userId, { ...review, isProblem: true });
    }

    // Vérifier si tous les participants ont validé
    await this.checkAndProcessPayments(rideId);
  }

  private async checkAndProcessPayments(rideId: number): Promise<void> {
    const ride = await this.rideRepo.findOne({
      where: { id: rideId },
      relations: ['participations', 'driver', 'driver.wallet'],
    });
    if (!ride) {
      throw new NotFoundException('Trajet non trouvé');
    }

    const allValidated = ride.participations.every(
      (p) => p.validatedAt !== null,
    );
    const hasProblems = ride.participations.some((p) => !p.validationSuccess);

    if (allValidated && !hasProblems) {
      // Tout va bien : processus les paiements
      await this.processSuccessfulPayments(ride);
    } else if (allValidated && hasProblems) {
      // Problèmes signalés : en attente de modération
      ride.status = 'pending_moderation';
      await this.rideRepo.save(ride);
    }
    // Todo implementer l'envoi d'email de confirmation
    // await this.emailService.sendModerationNeededEmail(ride.id);
  }

  private async processSuccessfulPayments(ride: Ride): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Calculer les montants
      const rideCost = ride.price;
      const platformCommission = 2;
      const participantCount = ride.participations.length;

      // Créditer le conducteur
      const driverEarnings = rideCost * participantCount;
      ride.driver.wallet.balance += driverEarnings;
      await manager.save(ride.driver.wallet);

      // Créditer la plateforme
      const platform = await manager.findOne(Platform, {
        where: { id: 1 },
        relations: ['wallet'],
      });

      if (!platform || !platform.wallet) {
        throw new Error('Plateforme non configurée');
      }

      const platformEarnings = platformCommission * participantCount;
      platform.wallet.balance += platformEarnings;
      await manager.save(platform.wallet);

      // Créer les transactions finales
      const driverTransaction = this.transactionRepo.create({
        wallet: ride.driver.wallet,
        platform: platform,
        amount: driverEarnings,
        type: 'ride_completed_driver_payment',
        date: new Date(),
        description: `Paiement trajet #${ride.id} - ${participantCount} participant(s)`,
        status: 'completed',
      });
      await manager.save(driverTransaction);

      const platformTransaction = this.transactionRepo.create({
        wallet: platform.wallet,
        platform: platform,
        amount: platformEarnings,
        type: 'ride_completed_platform_commission',
        date: new Date(),
        description: `Commission trajet #${ride.id} - ${participantCount} participant(s)`,
        status: 'completed',
      });
      await manager.save(platformTransaction);

      // Mettre à jour les transactions en attente vers "completed"
      const pendingTransactions = await manager.find(Transaction, {
        where: { type: 'ride_participation_pending' },
      });

      for (const transaction of pendingTransactions) {
        if (transaction.description.includes(`trajet #${ride.id}`)) {
          transaction.status = 'completed';
          await manager.save(transaction);
        }
      }

      // Finaliser le statut du trajet
      ride.status = 'payment_completed';
      await manager.save(ride);
    });
  }
  // Méthode pour la modération (après résolution des problèmes)
  async approvePaymentsAfterModeration(rideId: number): Promise<void> {
    const ride = await this.rideRepo.findOne({
      where: { id: rideId, status: 'pending_moderation' },
      relations: ['participations', 'driver', 'driver.wallet'],
    });

    if (!ride) {
      throw new NotFoundException(
        'Trajet non trouvé ou pas en attente de modération',
      );
    }

    await this.processSuccessfulPayments(ride);
  }
  // Méthode pour annuler et rembourser (en cas de gros problème)
  async cancelAndRefund(rideId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const ride = await manager.findOne(Ride, {
        where: { id: rideId },
        relations: [
          'participations',
          'participations.user',
          'participations.user.wallet',
        ],
      });

      if (!ride) {
        throw new NotFoundException('Trajet non trouvé');
      }

      // Rembourser tous les participants
      for (const participation of ride.participations) {
        const rideCost = ride.price;
        const platformCommission = 2;
        const totalCost = rideCost + platformCommission;

        participation.user.wallet.balance += totalCost;
        await manager.save(participation.user.wallet);

        // Créer transaction de remboursement
        // Todo voir si y'a pas + simple
        const platform = await manager.findOne(Platform, { where: { id: 1 } });
        if (!platform) {
          throw new Error('Plateforme non configurée');
        }

        const refundTransaction = this.transactionRepo.create({
          wallet: participation.user.wallet,
          platform: platform,
          amount: totalCost,
          type: 'ride_cancelled_refund',
          date: new Date(),
          description: `Remboursement trajet annulé #${ride.id}`,
          status: 'completed',
        });
        await manager.save(refundTransaction);
      }

      ride.status = 'cancelled';
      await manager.save(ride);
    });
  }
}
