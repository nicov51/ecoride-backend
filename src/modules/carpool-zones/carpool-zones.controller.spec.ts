import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolZonesController } from './carpool-zones.controller';

describe('CarpoolZonesController', () => {
  let controller: CarpoolZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarpoolZonesController],
    }).compile();

    controller = module.get<CarpoolZonesController>(CarpoolZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
