import { Test, TestingModule } from '@nestjs/testing';
import { GeocodingController } from './geocoding.controller';

describe('MapController', () => {
  let controller: GeocodingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeocodingController],
    }).compile();

    controller = module.get<GeocodingController>(GeocodingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
