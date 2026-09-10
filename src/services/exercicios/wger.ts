import { GRUPOS, type Exercicio, type Grupo, type GrupoId } from '@/types'
import type { FonteExercicios } from './types'

/**
 * Adaptador da API publica do wger (https://wger.de/api/v2), sem chave e com CORS liberado.
 *
 * Duas armadilhas tratadas aqui:
 * 1. wger nao tem categoria "Biceps"/"Triceps" — sao MUSCULOS (id 1 e 5), nao categorias.
 *    Por isso o mapa abaixo permite filtrar por `category` OU por `muscles`.
 * 2. Cobertura de imagem e parcial (~377 imagens para ~948 exercicios). Exercicio sem
 *    imagem volta com `imagem: null` e a UI desenha um placeholder.
 */
const BASE = 'https://wger.de/api/v2'
const LANG_EN = 2

type Filtro = { categoria?: number; musculo?: number }

const MAPA: Record<GrupoId, Filtro> = {
  peito: { categoria: 11 },
  costas: { categoria: 12 },
  pernas: { categoria: 9 },
  ombro: { categoria: 13 },
  biceps: { musculo: 1 },
  triceps: { musculo: 5 },
}

interface WgerTraducao {
  language: number
  name: string
  description: string
}

interface WgerExercicio {
  id: number
  category: { id: number; name: string }
  muscles: { id: number }[]
  equipment: { id: number; name: string }[]
  images: { image: string; is_main: boolean }[]
  translations: WgerTraducao[]
}

const semHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function normalizar(bruto: WgerExercicio, grupo: GrupoId): Exercicio | null {
  const traducao =
    bruto.translations.find((t) => t.language === LANG_EN) ?? bruto.translations[0]
  if (!traducao?.name) return null

  const principal = bruto.images.find((i) => i.is_main) ?? bruto.images[0]

  return {
    id: `wger-${bruto.id}`,
    nome: traducao.name,
    grupo,
    // a API nao tem esse conceito; a classificacao por nivel vive no catalogo curado
    nivel: 'intermediario',
    imagem: principal?.image ?? null,
    equipamento: bruto.equipment.map((e) => e.name).join(', ') || null,
    instrucoes: traducao.description ? semHtml(traducao.description) : null,
    fonte: 'wger',
  }
}

export const fonteWger: FonteExercicios = {
  id: 'wger',
  rotulo: 'wger.de (API pública)',

  async listarGrupos(): Promise<Grupo[]> {
    return GRUPOS
  },

  async listarExercicios(grupo: GrupoId): Promise<Exercicio[]> {
    const filtro = MAPA[grupo]
    const params = new URLSearchParams({
      format: 'json',
      language: String(LANG_EN),
      limit: '80',
    })
    if (filtro.categoria) params.set('category', String(filtro.categoria))
    if (filtro.musculo) params.set('muscles', String(filtro.musculo))

    const resp = await fetch(`${BASE}/exerciseinfo/?${params.toString()}`)
    if (!resp.ok) throw new Error(`wger respondeu ${resp.status}`)

    const dados = (await resp.json()) as { results: WgerExercicio[] }

    return dados.results
      .map((b) => normalizar(b, grupo))
      .filter((e): e is Exercicio => e !== null)
      // exercicio com imagem primeiro: o app e visual, sem foto perde a graca
      .sort((a, b) => Number(Boolean(b.imagem)) - Number(Boolean(a.imagem)))
  },
}
