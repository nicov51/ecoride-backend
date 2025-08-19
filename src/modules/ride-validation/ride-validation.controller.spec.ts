import { Test, TestingModule } from '@nestjs/testing';
import { RideValidationController } from './ride-validation.controller';

describe('RideValidationController', () => {
  let controller: RideValidationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideValidationController],
    }).compile();

    controller = module.get<RideValidationController>(RideValidationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
