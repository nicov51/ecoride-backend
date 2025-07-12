import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../../models/car.entity';
import { User } from '../../models/user.entity';
import { CreateCarDto } from '../../dto/create-car.dto';
import { UpdateCarDto } from '../../dto/update-car.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}
  async create(dto: CreateCarDto): Promise<Car> {
    const owner = await this.userRepository.findOne({
      where: { id: dto.ownerId },
    });
    if (!owner) throw new NotFoundException('Utilisateur non trouvé');
    const car = this.carRepository.create({
      ...dto,
      firstRegistration: new Date(dto.firstRegistration),
      owner,
    });
    await this.carRepository.save(car);
    //assigner le role driver
    await this.rolesService.assignDriverRole(owner.id);
    return car;
  }

  async findAllByUser(userId: number): Promise<Car[]> {
    return this.carRepository.find({
      where: { owner: { id: userId } },
      relations: ['brand'],
    });
  }

  async update(id: number, dto: UpdateCarDto): Promise<Car> {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException('Voiture non trouvée');
    }

    Object.assign(car, dto); // met à jour uniquement les champs fournis

    return this.carRepository.save(car);
  }

  async delete(id: number, userId: number): Promise<void> {
    const car = await this.carRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!car) throw new NotFoundException('La voiture existe pas');
    await this.carRepository.remove(car);
  }
}
