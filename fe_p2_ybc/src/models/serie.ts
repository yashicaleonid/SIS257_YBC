import type { Pais } from './pais';
export interface Serie {
  id: number
  idPais: number
  titulo: string
  sinopsis: string
  director: string
  temporadas: number
  fechaEstreno: Date
  plataforma_principal: string
  pais: Pais
}


