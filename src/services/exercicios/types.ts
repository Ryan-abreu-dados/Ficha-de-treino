import type { Exercicio, Grupo, GrupoId } from '@/types'

/**
 * Contrato unico de fonte de exercicios.
 * Trocar mock por API real = trocar qual objeto exporta daqui, nada mais.
 */
export interface FonteExercicios {
  id: string
  rotulo: string
  listarGrupos(): Promise<Grupo[]>
  listarExercicios(grupo: GrupoId): Promise<Exercicio[]>
}
