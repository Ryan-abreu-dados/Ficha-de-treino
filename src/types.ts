/** Grupos musculares que a interface oferece no filtro. */
export type GrupoId =
  | 'peito'
  | 'costas'
  | 'pernas'
  | 'ombro'
  | 'biceps'
  | 'triceps'

export interface Grupo {
  id: GrupoId
  nome: string
}

/**
 * Formato normalizado de exercicio.
 * Toda fonte de dados (mock, wger, o que vier depois) precisa devolver
 * exatamente isso — a interface nunca conhece o formato cru da API.
 */
export interface Exercicio {
  id: string
  nome: string
  grupo: GrupoId
  imagem: string | null
  equipamento?: string | null
  instrucoes?: string | null
  /** nome como veio da origem; serve pra busca funcionar em ingles tambem */
  nomeOriginal?: string
  fonte?: 'mock' | 'wger' | 'catalogo'
}

/** Um exercicio ja configurado dentro de um treino. */
export interface ItemFicha {
  itemId: string
  exercicioId: string
  nome: string
  /** opcional: fichas salvas antes desta versao nao tem */
  nomeOriginal?: string
  grupo: GrupoId
  imagem: string | null
  series: number
  reps: number
  carga: string
  obs: string
  adicionadoEm: string
}

export interface Treino {
  id: string
  nome: string
  itens: ItemFicha[]
}

/** Raiz do que vai pro localStorage. `versao` existe pra permitir migracao futura. */
export interface Ficha {
  versao: 1
  treinos: Treino[]
  atualizadoEm: string
}

export const GRUPOS: Grupo[] = [
  { id: 'peito', nome: 'Peito' },
  { id: 'costas', nome: 'Costas' },
  { id: 'pernas', nome: 'Pernas' },
  { id: 'ombro', nome: 'Ombro' },
  { id: 'biceps', nome: 'Bíceps' },
  { id: 'triceps', nome: 'Tríceps' },
]

export const NOME_GRUPO: Record<GrupoId, string> = GRUPOS.reduce(
  (acc, g) => ({ ...acc, [g.id]: g.nome }),
  {} as Record<GrupoId, string>,
)
