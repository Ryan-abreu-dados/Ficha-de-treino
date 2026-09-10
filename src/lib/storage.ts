import type { Ficha, Treino } from '@/types'

const CHAVE = 'ficha-do-ryan:v1'

export function fichaInicial(): Ficha {
  const treinos: Treino[] = ['A', 'B', 'C'].map((letra) => ({
    id: `treino-${letra.toLowerCase()}`,
    nome: `Treino ${letra}`,
    itens: [],
  }))
  return { versao: 1, treinos, atualizadoEm: new Date().toISOString() }
}

/**
 * Leitura defensiva: localStorage pode estar bloqueado (aba anonima, cookies off),
 * conter JSON quebrado ou uma versao antiga do schema. Em qualquer um desses casos
 * o app precisa abrir vazio em vez de dar tela branca.
 */
export function carregarFicha(): Ficha {
  try {
    const cru = localStorage.getItem(CHAVE)
    if (!cru) return fichaInicial()

    const dados = JSON.parse(cru) as Partial<Ficha>
    if (dados?.versao !== 1 || !Array.isArray(dados.treinos)) return fichaInicial()

    return {
      versao: 1,
      treinos: dados.treinos.map((t) => ({
        id: String(t.id),
        nome: String(t.nome ?? 'Treino'),
        itens: Array.isArray(t.itens) ? t.itens : [],
      })),
      atualizadoEm: dados.atualizadoEm ?? new Date().toISOString(),
    }
  } catch {
    return fichaInicial()
  }
}

export function salvarFicha(ficha: Ficha): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(ficha))
  } catch {
    // cota estourada ou storage bloqueado: nao ha o que fazer alem de nao quebrar a UI
  }
}

export function exportarFicha(ficha: Ficha): void {
  const blob = new Blob([JSON.stringify(ficha, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ficha-do-ryan-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
