import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participation } from '../../models/participation.entity';
import { User } from '../../models/user.entity';
import { Ride } from '../../models/ride.entity';
import { Repository } from 'typeorm';
import { CreateParticipationDto } from '../../dto/create-participation.dto';
import { ParticipationResponseDto } from '../../dto/participation-response.dto';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private participationRepo: Repository<Participation>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Ride)
    private rideRepo: Repository<Ride>,
  ) {}
  async create(dto: CreateParticipationDto): Promise<ParticipationResponseDto> {
    const user = await this.userRepo.findOneBy({
      id: dto.userId,
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const ride = await this.rideRepo.findOneBy({ id: dto.rideId });
    if (!ride) throw new NotFoundException('Trajet non trouvé');
    //on sauvegarde l'entité sans relation
    const participation = this.participationRepo.create({
      ride,
      user,
      joinedAt: new Date(),
    });
    const savedParticipation = await this.participationRepo.save(participation);
    //on recharge les relations
    const participationWithRelations =
      await this.participationRepo.findOneOrFail({
        where: { id: savedParticipation.id },
        relations: ['user', 'ride'],
      });
    return new ParticipationResponseDto(participationWithRelations);
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
