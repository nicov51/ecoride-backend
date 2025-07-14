import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolZonesService } from './carpool-zones.service';

describe('CarpoolZonesService', () => {
  let service: CarpoolZonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarpoolZonesService],
    }).compile();

    service = module.get<CarpoolZonesService>(CarpoolZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
