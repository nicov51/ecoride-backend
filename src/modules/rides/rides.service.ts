import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ride } from '../../models/ride.entity';
import { User } from '../../models/user.entity';
import { Car } from '../../models/car.entity';
import { CarpoolZone } from '../../models/carpool-zone.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRideDto } from '../../dto/create-ride.dto';
import { RideResponseDto } from '../../dto/ride-response.dto';
import { RideFiltersDto } from '../../dto/ride-filters.dto';
import { RidePreferences } from '../../models/ride-preferences';

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
    return rides.map((r) => new RideResponseDto(r));
  }

  private buildSearchQuery(filters: RideFiltersDto) {
    const query = this.rideRepo
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.driver', 'driver')
      .leftJoinAndSelect('ride.car', 'car');
    // Filtres de base
    if (filters.from) {
      query.andWhere('ride.departurePlace LIKE :from', {
        from: `%${filters.from}%`,
      });
    }
    // Ajoutez d'autres filtres de la même manière
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

    // Trie par défaut
    query.addOrderBy('ride.departureDateTime', 'ASC');
  }

  // async getLastRidePreferences(
  //   userId: number,
  // ): Promise<RidePreferences | undefined> {
  //   const lastRide = await this.rideRepo.findOne({
  //     where: { driver: { id: userId } },
  //     order: { id: 'DESC' },
  //     select: ['preferences'],
  //   });
  //   return lastRide?.preferences;
  // }
}
