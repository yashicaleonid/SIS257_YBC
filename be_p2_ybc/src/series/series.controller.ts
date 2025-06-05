import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeriesService } from './series.service';
import { CreateSerieDto } from './dto/create-serie.dto';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una serie' })
  create(@Body() createSerieDto: CreateSerieDto) {
    return this.seriesService.create(createSerieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de series' })
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una serie por su id' })
  findOne(@Param('id') id: number) {
    return this.seriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una serie por su id' })
  update(@Param('id') id: number, @Body() updateSerieDto: CreateSerieDto) {
    return this.seriesService.update(id, updateSerieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una serie por su id' })
  remove(@Param('id') id: number) {
    return this.seriesService.remove(id);
  }
}
