import { Test, TestingModule } from '@nestjs/testing';
import { RgpdController } from './rgpd.controller';

describe('RgpdController', () => {
  let controller: RgpdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RgpdController],
    }).compile();

    controller = module.get<RgpdController>(RgpdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
