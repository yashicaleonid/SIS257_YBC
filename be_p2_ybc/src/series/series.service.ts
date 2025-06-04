import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Serie } from './entities/serie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(@InjectRepository(Serie) private seriesRepository: Repository<Serie>) {}

  async create(createSerieDto: CreateSerieDto): Promise<Serie> {
    const existe = await this.seriesRepository.findOneBy({
      titulo: createSerieDto.titulo.trim(),
      idPais: createSerieDto.idPais,
    });

    if (existe) throw new ConflictException('La serie ya existe');

    const serie = new Serie();
    serie.idPais = createSerieDto.idPais;
    serie.titulo = createSerieDto.titulo.trim();
    serie.sinopsis = createSerieDto.sinopsis.trim();
    serie.director = createSerieDto.director.trim();
    serie.temporadas = createSerieDto.temporadas;
    serie.fechaEstreno = createSerieDto.fechaEstreno;
    return this.seriesRepository.save(serie);
  }

  async findAll(): Promise<Serie[]> {
    return this.seriesRepository.find({
      relations: { pais: true },
      select: {
        id: true,
        titulo: true,
        sinopsis: true,
        director: true,
        temporadas: true,
        fechaEstreno: true,
        pais: { id: true, descripcion: true },
      },
    });
  }

  async findOne(id: number): Promise<Serie> {
    const serie = await this.seriesRepository.findOne({
      where: { id },
      relations: { pais: true },
    });

    if (!serie) throw new NotFoundException('La serie no existe');

    return serie;
  }

  async findAllByPais(idPais: number): Promise<Serie[]> {
    return this.seriesRepository.findBy({ idPais });
  }

  async update(id: number, updateSerieDto: UpdateSerieDto): Promise<Serie> {
    const serie = await this.findOne(id);
    Object.assign(serie, updateSerieDto);
    return this.seriesRepository.save(serie);
  }

  async remove(id: number) {
    const serie = await this.findOne(id);
    return this.seriesRepository.softRemove(serie);
  }
}
