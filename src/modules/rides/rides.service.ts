import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ride } from '../../models/ride.entity';
import { User } from '../../models/user.entity';
import { Car } from '../../models/car.entity';
import { CarpoolZone } from '../../models/carpool-zone.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRideDto } from '../../dto/create-ride.dto';
import { RideResponseDto } from '../../dto/ride-response.dto';
import { RideFiltersDto } from '../../dto/ride-filters.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private rideRepo: Repository<Ride>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Car)
    private carRepo: Repository<Car>,
    @InjectRepository(CarpoolZone)
    private carpoolZoneRepo: Repository<CarpoolZone>,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateRideDto): Promise<RideResponseDto> {
    // 1. On récupère le chauffeur depuis son ID
    const driver = await this.userRepo.findOneBy({ id: dto.driverId });
    if (!driver) throw new NotFoundException('Chauffeur non trouvé');

    // 2. On récupère la voiture liée au trajet
    const car = await this.carRepo.findOneBy({ id: dto.carId });
    if (!car) throw new NotFoundException('Voiture non trouvée');

    // 3. On récupère les zones de départ et d’arrivée
    const departureZone = await this.carpoolZoneRepo.findOneBy({
      id: dto.departureZoneId,
    });
    if (!departureZone)
      throw new NotFoundException('Zone de départ introuvable');

    const arrivalZone = await this.carpoolZoneRepo.findOneBy({
      id: dto.arrivalZoneId,
    });
    if (!arrivalZone) throw new NotFoundException('Zone d’arrivée introuvable');

    // 4. On crée le trajet
    const ride = this.rideRepo.create({
      ...dto,
      driver,
      car,
      departureZone,
      arrivalZone,
      options: dto.options || {
        petsAllowed: false,
        luggageAllowed: false,
        airConditioning: false,
      },
      preferences: dto.preferences || {
        chat: 'neutre',
        smoking: 'non',
        music: 'modérée',
        pets: 'non',
        other: '',
      },
    });

    // 5. On sauvegarde le trajet
    const savedRide = await this.rideRepo.save(ride);

    // 6. On recharge avec toutes les relations pour le retour
    const rideWithRelations = await this.rideRepo.findOne({
      where: { id: savedRide.id },
      relations: [
        'driver',
        'car',
        'departureZone',
        'arrivalZone',
        'participations',
        'reviews',
      ],
    });

    if (!rideWithRelations) {
      throw new NotFoundException('Trajet non trouvé après création');
    }

    // 7. On renvoie un DTO propre
    return new RideResponseDto(rideWithRelations);
  }

  async findAll(): Promise<RideResponseDto[]> {
    const rides = await this.rideRepo.find({
      relations: [
        'driver',
        'car',
        'departureZone',
        'arrivalZone',
        'participations',
        'reviews',
      ],
    });
    return rides.map((r) => new RideResponseDto(r));
  }

  async findMyRides(userId: number): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { driver: { id: userId } },
      relations: [
        'driver',
        'car',
        'departureZone',
        'arrivalZone',
        'participations',
        'reviews',
      ],
    });
  }

  async searchRides(filters: RideFiltersDto): Promise<RideResponseDto[]> {
    const query = this.buildSearchQuery(filters);
    const rides = await query.getMany();
    return rides.map((ride) => new RideResponseDto(ride));
  }

  private buildSearchQuery(filters: RideFiltersDto) {
    const query = this.rideRepo
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.driver', 'driver')
      .leftJoinAndSelect('ride.car', 'car')
      .leftJoinAndSelect('ride.departureZone', 'departureZone')
      .leftJoinAndSelect('ride.arrivalZone', 'arrivalZone')
      .leftJoinAndSelect('ride.participations', 'participations')
      .leftJoinAndSelect('participations.user', 'participationUser')
      .where('ride.seats > 0');

    // Filtres de base
    if (filters.from) {
      query.andWhere('LOWER(ride.departurePlace) LIKE LOWER(:from)', {
        from: `%${filters.from.toLowerCase()}%`,
      });
    }
    if (filters.to) {
      query.andWhere('LOWER(ride.arrivalPlace) LIKE LOWER(:to)', {
        to: `%${filters.to.toLowerCase()}%`,
      });
    }
    if (filters.date) {
      // Recherche sur +- 3 jours autour de la date demandée
      const startDate = new Date(filters.date);
      startDate.setDate(startDate.getDate() - 3);

      const endDate = new Date(filters.date);
      endDate.setDate(endDate.getDate() + 3);

      query.andWhere('ride.departureDateTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    this.applyAdvancedFilters(query, filters);
    return query;
  }

  private applyAdvancedFilters(
    query: SelectQueryBuilder<Ride>,
    filters: RideFiltersDto,
  ) {
    // Exemple de filtre avancé
    if (filters.minPrice) {
      query.andWhere('ride.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('ride.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.maxDuration) {
      query.andWhere(
        'TIMESTAMPDIFF(MINUTE, ride.departureDateTime, ride.arrivalDateTime) <= :maxDuration',
        {
          maxDuration: filters.maxDuration,
        },
      );
    }

    if (filters.seats) {
      query.andWhere('ride.seats >= :seats', {
        seats: filters.seats,
      });
    }

    if (filters.electricOnly) {
      query.andWhere('car.fuel = :fuel', {
        fuel: 'ELECTRIC',
      });
    }

    if (filters.departureZoneId) {
      query.andWhere('ride.departureZoneId = :departureZoneId', {
        departureZoneId: filters.departureZoneId,
      });
    }

    if (filters.arrivalZoneId) {
      query.andWhere('ride.arrivalZoneId = :arrivalZoneId', {
        arrivalZoneId: filters.arrivalZoneId,
      });
    }

    // Tri par défaut
    query.addOrderBy('ride.departureDateTime', 'ASC');
  }
  async startRide(rideId: number, driverId: number): Promise<void> {
    const ride = await this.rideRepo.findOne({
      where: { id: rideId, driver: { id: driverId } },
    });

    if (!ride) throw new NotFoundException('Trajet non trouvé');
    if (ride.status !== 'confirmed')
      throw new ConflictException('Trajet ne peut pas être démarré');

    ride.status = 'in_progress';
    ride.startedAt = new Date();
    await this.rideRepo.save(ride);
  }

  async completeRide(rideId: number, driverId: number): Promise<void> {
    const ride = await this.rideRepo.findOne({
      where: { id: rideId, driver: { id: driverId } },
      relations: ['participations', 'participations.user', 'driver'],
    });

    if (!ride) throw new NotFoundException('Trajet non trouvé');
    if (ride.status !== 'in_progress')
      throw new ConflictException('Trajet non démarré');

    ride.status = 'completed';
    ride.completedAt = new Date();
    await this.rideRepo.save(ride);

    //Envoyer emails aux participants pour validation
    this.sendValidationEmails(ride);
  }

  private async sendValidationEmails(ride: Ride): Promise<void> {
    const emailData = {
      rideTitle: `${ride.departurePlace} -> ${ride.arrivalPlace}`,
      driverName: ride.driver.name,
      participants: ride.participations.map((p) => ({
        email: p.user.email,
        name: p.user.name,
      })),
      rideId: ride.id,
    };
    await this.emailService.sendRideCompleted(emailData);
  }

  async cancelRide(
    rideId: number,
    driverId: number,
    reason?: string,
  ): Promise<void> {
    const ride = await this.rideRepo.findOne({
      where: { id: rideId, driver: { id: driverId } },
      relations: ['participations', 'participations.user', 'driver'],
    });

    if (!ride) throw new NotFoundException('Trajet non trouvé');
    if (ride.status === 'completed')
      throw new ConflictException('Trajet déjà terminé');

    ride.status = 'cancelled';
    await this.rideRepo.save(ride);

    //Envoyer emails d'annulation
    const emailData = {
      rideTitle: `${ride.departurePlace} → ${ride.arrivalPlace}`,
      driverName: ride.driver.name,
      participants: ride.participations.map((p) => ({
        email: p.user.email,
        name: p.user.name,
      })),
      departureDate: ride.departureDateTime.toLocaleDateString('fr-FR'),
      reason,
    };

    await this.emailService.sendRideCancellation(emailData);
  }
}
