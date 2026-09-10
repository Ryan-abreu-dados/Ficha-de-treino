import { fonteCatalogo } from './catalogo'
import { fonteMock } from './mock'
import { fonteWger } from './wger'
import type { FonteExercicios } from './types'

export type { FonteExercicios } from './types'
export { fonteCatalogo, fonteMock, fonteWger }

/**
 * Ponto unico de troca de fonte de dados.
 * Trocar a origem dos exercicios nao encosta em componente nenhum.
 */
const FONTES: Record<string, FonteExercicios> = {
  catalogo: fonteCatalogo,
  mock: fonteMock,
  wger: fonteWger,
}

const escolhida = import.meta.env.VITE_FONTE_EXERCICIOS ?? 'catalogo'

export const fonteExercicios: FonteExercicios = FONTES[escolhida] ?? fonteCatalogo
