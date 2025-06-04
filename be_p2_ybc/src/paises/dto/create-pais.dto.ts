import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaisDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripción es requerido' })
  @IsString({ message: 'El campo descripción debe ser una cadena' })
  @Length(1, 30, { message: 'El campo descripción debe tener entre 1 y 30 caracteres' })
  readonly descripcion: string;
}
