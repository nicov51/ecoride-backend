import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarpoolZone } from '../../models/carpool-zone.entity';
import { Repository } from 'typeorm';
import { CreateCarpoolZoneDto } from '../../dto/create-carpool-zone.dto';

@Injectable()
export class CarpoolZonesService {
  constructor(
    @InjectRepository(CarpoolZone)
    private carpoolZoneRepo: Repository<CarpoolZone>,
  ) {}
  create(dto: CreateCarpoolZoneDto) {
    const zone = this.carpoolZoneRepo.create(dto);
    return this.carpoolZoneRepo.save(zone);
  }
  findAll() {
    return this.carpoolZoneRepo.find();
  }
  async remove(id: number) {
    const z = await this.carpoolZoneRepo.findOneByOrFail({ id });
    return this.carpoolZoneRepo.remove(z);
  }
}
