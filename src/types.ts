/** Grupos musculares que a interface oferece no filtro. */
export type GrupoId =
  | 'peito'
  | 'costas'
  | 'pernas'
  | 'ombro'
  | 'biceps'
  | 'triceps'

/** Nivel tecnico do exercicio (risco/coordenacao), nao nivel do praticante. */
export type Nivel = 'iniciante' | 'intermediario' | 'avancado'

/** Ordem importa: o filtro e cumulativo, mostra tudo ate o nivel escolhido. */
export const NIVEIS: { id: Nivel; nome: string; curto: string }[] = [
  { id: 'iniciante', nome: 'Iniciante', curto: 'Ini' },
  { id: 'intermediario', nome: 'Intermediário', curto: 'Int' },
  { id: 'avancado', nome: 'Avançado', curto: 'Avç' },
]

export const ORDEM_NIVEL: Record<Nivel, number> = {
  iniciante: 0,
  intermediario: 1,
  avancado: 2,
}

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
  nivel: Nivel
  imagem: string | null
  equipamento?: string | null
  instrucoes?: string | null
  /** nome como veio da origem; serve pra busca funcionar em ingles tambem */
  nomeOriginal?: string
  fonte?: 'mock' | 'wger' | 'catalogo' | 'manual'
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

/** Uma serie executada: o peso e as repeticoes que realmente saíram. */
export interface SerieFeita {
  peso: number
  reps: number
}

/**
 * O que foi feito de um exercicio num dia.
 *
 * Guarda `exercicioId` (do catalogo, estavel) e NAO o `itemId` da ficha: assim o
 * historico sobrevive a voce excluir o exercicio da ficha, reordenar, trocar de
 * treino ou aplicar uma ficha pronta por cima. `nome` e `grupo` sao copia do
 * momento — se o exercicio sumir do catalogo um dia, o historico continua legivel.
 */
export interface RegistroExercicio {
  exercicioId: string
  nome: string
  grupo: GrupoId
  series: SerieFeita[]
}

/** Um dia de treino registrado. */
export interface Sessao {
  id: string
  /** AAAA-MM-DD, sem hora: o que importa e o dia */
  data: string
  treinoId: string
  /** copia do nome, porque o treino pode ser renomeado ou apagado depois */
  treinoNome: string
  registros: RegistroExercicio[]
  criadoEm: string
}

export interface Historico {
  versao: 1
  sessoes: Sessao[]
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
