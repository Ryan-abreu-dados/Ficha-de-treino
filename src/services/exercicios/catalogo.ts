import bruto from './catalogo.json'
import { GRUPOS, type Exercicio, type Grupo, type GrupoId } from '@/types'
import type { FonteExercicios } from './types'

/**
 * Catalogo estatico gerado por `npm run catalogo` a partir do wger.
 * E a fonte padrao do app: ja vem filtrado (so exercicio com imagem, sem
 * alongamento) e com os nomes em portugues, entao abre instantaneo e offline.
 */
const CATALOGO = bruto as unknown as Exercicio[]

export const fonteCatalogo: FonteExercicios & {
  total: number
  acharPorId: (id: string, grupo?: string) => Exercicio | null
} = {
  id: 'catalogo',
  rotulo: 'Catálogo wger (embutido)',
  total: CATALOGO.length,

  /**
   * O mesmo id aparece em dois grupos (Chin Up em costas e biceps, Dips em peito
   * e triceps), entao o grupo desempata. Sem ele, o exercicio entraria na ficha
   * rotulado com o grupo errado.
   */
  acharPorId(id, grupo) {
    if (grupo) {
      const exato = CATALOGO.find((e) => e.id === id && e.grupo === grupo)
      if (exato) return exato
    }
    return CATALOGO.find((e) => e.id === id) ?? null
  },

  async listarGrupos(): Promise<Grupo[]> {
    return GRUPOS
  },

  async listarExercicios(grupo: GrupoId): Promise<Exercicio[]> {
    return CATALOGO.filter((e) => e.grupo === grupo)
  },
}
