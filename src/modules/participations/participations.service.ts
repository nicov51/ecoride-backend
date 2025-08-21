import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Participation,
  ParticipationStatus,
} from '../../models/participation.entity';
import { User } from '../../models/user.entity';
import { Ride } from '../../models/ride.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateParticipationDto } from '../../dto/create-participation.dto';
import { ParticipationResponseDto } from '../../dto/participation-response.dto';
import { Platform } from '../../models/platform.entity';
import { Transaction } from '../../models/transaction.entity';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private participationRepo: Repository<Participation>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Ride)
    private rideRepo: Repository<Ride>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateParticipationDto & { userId: number },
  ): Promise<ParticipationResponseDto> {
    // 1. Vérif si l'user participe déjà à ce trajet
    const alreadyParticipating = await this.participationRepo.findOne({
      where: {
        user: { id: dto.userId },
        ride: { id: dto.rideId },
      },
    });

    if (alreadyParticipating) {
      throw new ConflictException('Vous participez déjà à ce trajet');
    }

    // 2. Récupére l'utilisateur avec son wallet
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
      relations: ['wallet'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.wallet) {
      throw new NotFoundException('Wallet utilisateur non trouvé');
    }

    // 3. Récupérer le trajet avec le driver et son wallet
    const ride = await this.rideRepo.findOne({
      where: { id: dto.rideId },
      relations: ['driver', 'driver.wallet'],
    });

    if (!ride) {
      throw new NotFoundException('Trajet non trouvé');
    }

    if (!ride.driver.wallet) {
      throw new NotFoundException('Wallet du conducteur non trouvé');
    }

    // 4. Vérifier que l'user n'est pas le conducteur
    if (ride.driver.id === dto.userId) {
      throw new ConflictException(
        'Vous ne pouvez pas participer à votre propre trajet',
      );
    }

    // 5. Calcul coûts selon US6
    const rideCost = ride.price;
    const platformCommission = 2; // 🟢 GARDER tes 2 crédits fixes
    const totalCost = rideCost + platformCommission;

    // 6. Vérifier si l'utilisateur a assez de crédits
    if (user.wallet.balance < totalCost) {
      throw new HttpException(
        `Crédits insuffisants. Coût total: ${totalCost} crédits (trajet: ${rideCost} + commission: ${platformCommission})`,
        402,
      );
    }

    // 7. Vérif s'il reste des places disponibles
    const currentParticipations = await this.participationRepo.count({
      where: { ride: { id: dto.rideId } },
    });

    if (currentParticipations >= ride.seats) {
      throw new ConflictException('Plus de places disponibles pour ce trajet');
    }

    // 8. Transaction pour assurer la cohérence des données
    return await this.dataSource.transaction(async (manager) => {
      // 8a. Créer la participation
      const participation = this.participationRepo.create({
        ride: ride,
        user: user,
        joinedAt: new Date(),
        status: ParticipationStatus.CONFIRMED,
        validatedAt: null, //  Pas encore validé
        validationSuccess: null, //  En attente
      });

      const savedParticipation = await manager.save(
        Participation,
        participation,
      );

      // 8b. Débiter le passager (coût total)
      user.wallet.balance -= totalCost;
      await manager.save(user.wallet);

      // on ne crédite pas le conducteur maintenant
      // ride.driver.wallet.balance += rideCost;
      // await manager.save(ride.driver.wallet);

      // 8d. Récupérer la plateforme
      const platform = await manager.findOne(Platform, {
        where: { id: 1 },
        relations: ['wallet'],
      });

      if (platform?.wallet) {
        // on ne credite plus la plateforme maintenant
        // platform.wallet.balance += platformCommission;
        // await manager.save(platform.wallet);

        // 8e. Créer transaction du passager en "pending"
        const passengerTransaction: Transaction = this.transactionRepo.create({
          wallet: user.wallet,
          platform: platform,
          amount: -totalCost,
          type: 'ride_participation_pending', // 🆕 Type en attente
          date: new Date(),
          description: `Participation au trajet #${ride.id} - Paiement en attente de validation`,
        });
        await manager.save(passengerTransaction);

        // les autres transactions attendront la fin du trajet
      }

      // 8f. Recharger la participation avec toutes les relations pour la réponse
      const participationWithRelations = await manager.findOne(Participation, {
        where: { id: savedParticipation.id },
        relations: ['user', 'ride', 'ride.driver'],
      });

      if (!participationWithRelations) {
        throw new Error('Erreur lors de la création de la participation');
      }

      // 8g. Retourner le DTO de réponse
      return new ParticipationResponseDto(participationWithRelations);
    });
  }

  async findAll(): Promise<ParticipationResponseDto[]> {
    const participations = await this.participationRepo.find({
      relations: ['user', 'ride'],
    });
    //on converti les entités en 1 tableau de dto pour pas les exposer directement
    return participations.map((p) => new ParticipationResponseDto(p));
  }
  async remove(id: number): Promise<void> {
    const participation = await this.participationRepo.findOneBy({ id });
    if (!participation)
      throw new NotFoundException('Participation non trouvée');
    await this.participationRepo.remove(participation);
  }
}
