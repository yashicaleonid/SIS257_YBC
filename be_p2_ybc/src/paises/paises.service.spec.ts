import { Test, TestingModule } from '@nestjs/testing';
import { PaisesService } from './paises.service';

describe('PaisesService', () => {
  let service: PaisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaisesService],
    }).compile();

    service = module.get<PaisesService>(PaisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
