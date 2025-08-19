import { Test, TestingModule } from '@nestjs/testing';
import { RideValidationService } from './ride-validation.service';

describe('RideValidationService', () => {
  let service: RideValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RideValidationService],
    }).compile();

    service = module.get<RideValidationService>(RideValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
