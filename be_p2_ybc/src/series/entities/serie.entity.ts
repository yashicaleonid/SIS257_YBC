import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pais } from '../../paises/entities/pais.entity';

@Entity('series')
export class Serie {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column('integer', { name: 'id_pais' })
  idPais: number;

  @Column('varchar', { length: 250 })
  titulo: string;

  @Column('varchar', { length: 5000 })
  sinopsis: string;

  @Column('varchar', { length: 100 })
  director: string;

  @Column('int')
  temporadas: number;

  @Column('date', { name: 'fecha_estreno' })
  fechaEstreno: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  plataforma_principal: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Pais, pais => pais.series)
  @JoinColumn({ name: 'id_pais', referencedColumnName: 'id' })
  pais: Pais;
}
