import type { Historico, Sessao } from '@/types'

const CHAVE = 'ficha-do-ryan:historico:v1'

export function historicoInicial(): Historico {
  return { versao: 1, sessoes: [] }
}

export function carregarHistorico(): Historico {
  try {
    const cru = localStorage.getItem(CHAVE)
    if (!cru) return historicoInicial()

    const dados = JSON.parse(cru) as Partial<Historico>
    if (dados?.versao !== 1 || !Array.isArray(dados.sessoes)) return historicoInicial()

    return { versao: 1, sessoes: dados.sessoes.filter(sessaoValida) }
  } catch {
    return historicoInicial()
  }
}

/**
 * Sessao sem registro ou sem data nao serve pra calcular nada e ainda quebraria
 * os graficos, entao e descartada na leitura em vez de virar linha fantasma.
 */
function sessaoValida(s: Sessao): boolean {
  return Boolean(s?.id && s?.data && Array.isArray(s?.registros) && s.registros.length > 0)
}

export function salvarHistorico(historico: Historico): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(historico))
  } catch {
    // storage cheio ou bloqueado: nao ha o que fazer alem de nao derrubar a UI
  }
}

/** Volume da sessao para um exercicio: soma de peso x reps de cada serie. */
export function volumeDoRegistro(series: { peso: number; reps: number }[]): number {
  return series.reduce((soma, s) => soma + s.peso * s.reps, 0)
}

export function cargaMaxima(series: { peso: number }[]): number {
  return series.reduce((max, s) => Math.max(max, s.peso), 0)
}

export function formatarData(iso: string): string {
  // constroi em horario local; `new Date('2026-09-10')` seria interpretado como
  // UTC e no Brasil voltaria um dia
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function hojeISO(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}
