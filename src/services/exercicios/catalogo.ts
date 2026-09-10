import bruto from './catalogo.json'
import { GRUPOS, type Exercicio, type Grupo, type GrupoId } from '@/types'
import type { FonteExercicios } from './types'

/**
 * Catalogo estatico gerado por `npm run catalogo` a partir do wger.
 * E a fonte padrao do app: ja vem filtrado (so exercicio com imagem, sem
 * alongamento) e com os nomes em portugues, entao abre instantaneo e offline.
 */
const CATALOGO = bruto as unknown as Exercicio[]

export const fonteCatalogo: FonteExercicios = {
  id: 'catalogo',
  rotulo: 'Catálogo wger (embutido)',

  async listarGrupos(): Promise<Grupo[]> {
    return GRUPOS
  },

  async listarExercicios(grupo: GrupoId): Promise<Exercicio[]> {
    return CATALOGO.filter((e) => e.grupo === grupo)
  },
}
