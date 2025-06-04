import { Test, TestingModule } from '@nestjs/testing';
import { PaisesController } from './paises.controller';
import { PaisesService } from './paises.service';

describe('PaisesController', () => {
  let controller: PaisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaisesController],
      providers: [PaisesService],
    }).compile();

    controller = module.get<PaisesController>(PaisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
