import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaisesService {
  constructor(@InjectRepository(Pais) private paisRepository: Repository<Pais>) {}

  async create(createPaisDto: CreatePaisDto): Promise<Pais> {
    const existe = await this.paisRepository.findOneBy({
      descripcion: createPaisDto.descripcion.trim(),
    });

    if (existe) throw new ConflictException('El país ya existe');

    const pais = new Pais();
    pais.descripcion = createPaisDto.descripcion.trim();
    return this.paisRepository.save(pais);
  }

  findAll() {
    return this.paisRepository.find({ order: { descripcion: 'ASC' } });
  }

  async findOne(id: number): Promise<Pais> {
    const pais = await this.paisRepository.findOneBy({ id });
    if (!pais) throw new NotFoundException('El país no existe');
    return pais;
  }

  async update(id: number, updatePaisDto: UpdatePaisDto) {
    const pais = await this.findOne(id);
    const paisUpdate = Object.assign(pais, updatePaisDto);
    return this.paisRepository.save(paisUpdate);
  }

  async remove(id: number) {
    const pais = await this.findOne(id);
    if (pais) return this.paisRepository.softDelete(id);
  }
}
