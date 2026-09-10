import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Historico, RegistroExercicio, Sessao } from '@/types'
import {
  carregarHistorico,
  cargaMaxima,
  historicoInicial,
  salvarHistorico,
  volumeDoRegistro,
} from '@/lib/historico'

const novoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export interface PontoEvolucao {
  data: string
  volume: number
  maxima: number
}

export interface EvolucaoExercicio {
  exercicioId: string
  nome: string
  sessoes: number
  pontos: PontoEvolucao[]
  primeiroVolume: number
  ultimoVolume: number
  /** variacao percentual de volume entre a primeira e a ultima sessao */
  variacao: number
  maiorCarga: number
}

export function useHistorico() {
  const [historico, setHistorico] = useState<Historico>(() => carregarHistorico())

  useEffect(() => {
    salvarHistorico(historico)
  }, [historico])

  const salvarSessao = useCallback(
    (
      dados: {
        data: string
        treinoId: string
        treinoNome: string
        registros: RegistroExercicio[]
      },
      /** id de uma sessao existente para sobrescrever em vez de criar outra */
      sessaoId?: string,
    ) => {
      // series sem peso nem reps sao ruido: quem pulou o exercicio nao registrou nada
      const registros = dados.registros
        .map((r) => ({ ...r, series: r.series.filter((s) => s.peso > 0 || s.reps > 0) }))
        .filter((r) => r.series.length > 0)

      if (registros.length === 0) return null

      const sessao: Sessao = {
        id: sessaoId ?? novoId(),
        data: dados.data,
        treinoId: dados.treinoId,
        treinoNome: dados.treinoNome,
        registros,
        criadoEm: new Date().toISOString(),
      }

      setHistorico((atual) => {
        const outras = atual.sessoes.filter((s) => s.id !== sessao.id)
        return {
          versao: 1,
          sessoes: [...outras, sessao].sort((a, b) => a.data.localeCompare(b.data)),
        }
      })

      return sessao.id
    },
    [],
  )

  const removerSessao = useCallback((id: string) => {
    setHistorico((atual) => ({
      versao: 1,
      sessoes: atual.sessoes.filter((s) => s.id !== id),
    }))
  }, [])

  const limparHistorico = useCallback(() => setHistorico(historicoInicial()), [])

  /** Sessoes da mais recente para a mais antiga, para listar na tela. */
  const sessoesRecentes = useMemo(
    () => [...historico.sessoes].sort((a, b) => b.data.localeCompare(a.data)),
    [historico.sessoes],
  )

  /**
   * Ultima carga registrada de cada exercicio, usada para pre-preencher o
   * formulario. E o que faz o registro do dia virar "conferir e salvar" em vez
   * de digitar tudo de novo.
   */
  const ultimasCargas = useMemo(() => {
    const mapa = new Map<string, number[]>()
    // ordem crescente: a ultima escrita de cada exercicio vence
    for (const sessao of [...historico.sessoes].sort((a, b) => a.data.localeCompare(b.data))) {
      for (const r of sessao.registros) {
        mapa.set(
          r.exercicioId,
          r.series.map((s) => s.peso),
        )
      }
    }
    return mapa
  }, [historico.sessoes])

  const evolucao = useMemo<EvolucaoExercicio[]>(() => {
    const porExercicio = new Map<string, { nome: string; pontos: PontoEvolucao[] }>()

    for (const sessao of [...historico.sessoes].sort((a, b) => a.data.localeCompare(b.data))) {
      for (const r of sessao.registros) {
        const atual = porExercicio.get(r.exercicioId) ?? { nome: r.nome, pontos: [] }
        atual.nome = r.nome
        atual.pontos.push({
          data: sessao.data,
          volume: volumeDoRegistro(r.series),
          maxima: cargaMaxima(r.series),
        })
        porExercicio.set(r.exercicioId, atual)
      }
    }

    return [...porExercicio.entries()]
      .map(([exercicioId, { nome, pontos }]) => {
        const primeiroVolume = pontos[0]?.volume ?? 0
        const ultimoVolume = pontos[pontos.length - 1]?.volume ?? 0
        return {
          exercicioId,
          nome,
          sessoes: pontos.length,
          pontos,
          primeiroVolume,
          ultimoVolume,
          // sem base de comparacao a variacao e 0, nao infinito
          variacao:
            primeiroVolume > 0
              ? ((ultimoVolume - primeiroVolume) / primeiroVolume) * 100
              : 0,
          maiorCarga: pontos.reduce((m, p) => Math.max(m, p.maxima), 0),
        }
      })
      .sort((a, b) => b.sessoes - a.sessoes || b.variacao - a.variacao)
  }, [historico.sessoes])

  return {
    historico,
    sessoesRecentes,
    ultimasCargas,
    evolucao,
    salvarSessao,
    removerSessao,
    limparHistorico,
    totalSessoes: historico.sessoes.length,
  }
}
