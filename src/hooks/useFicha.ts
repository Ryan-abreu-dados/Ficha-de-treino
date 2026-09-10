import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Exercicio, Ficha, ItemFicha } from '@/types'
import { carregarFicha, fichaInicial, salvarFicha } from '@/lib/storage'

const novoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/**
 * Estado da ficha inteira + espelhamento no localStorage.
 * A ficha e um objeto imutavel: toda mutacao devolve um objeto novo e o efeito
 * abaixo persiste. Isso mantem o formato serializavel — quando entrar login,
 * troca-se `salvarFicha` por um upsert no banco sem mexer em componente nenhum.
 */
export function useFicha() {
  const [ficha, setFicha] = useState<Ficha>(() => carregarFicha())
  const [treinoAtivoId, setTreinoAtivoId] = useState<string>(
    () => carregarFicha().treinos[0]?.id ?? '',
  )

  useEffect(() => {
    salvarFicha(ficha)
  }, [ficha])

  const atualizar = useCallback((fn: (f: Ficha) => Ficha) => {
    setFicha((atual) => ({ ...fn(atual), atualizadoEm: new Date().toISOString() }))
  }, [])

  const treinoAtivo = useMemo(
    () => ficha.treinos.find((t) => t.id === treinoAtivoId) ?? ficha.treinos[0],
    [ficha.treinos, treinoAtivoId],
  )

  const adicionarExercicio = useCallback(
    (treinoId: string, exercicio: Exercicio, series: number, reps: number) => {
      const item: ItemFicha = {
        itemId: novoId(),
        exercicioId: exercicio.id,
        nome: exercicio.nome,
        nomeOriginal: exercicio.nomeOriginal,
        grupo: exercicio.grupo,
        imagem: exercicio.imagem,
        series,
        reps,
        carga: '',
        obs: '',
        adicionadoEm: new Date().toISOString(),
      }
      atualizar((f) => ({
        ...f,
        treinos: f.treinos.map((t) =>
          t.id === treinoId ? { ...t, itens: [...t.itens, item] } : t,
        ),
      }))
    },
    [atualizar],
  )

  const editarItem = useCallback(
    (treinoId: string, itemId: string, campos: Partial<ItemFicha>) => {
      atualizar((f) => ({
        ...f,
        treinos: f.treinos.map((t) =>
          t.id === treinoId
            ? {
                ...t,
                itens: t.itens.map((i) => (i.itemId === itemId ? { ...i, ...campos } : i)),
              }
            : t,
        ),
      }))
    },
    [atualizar],
  )

  const removerItem = useCallback(
    (treinoId: string, itemId: string) => {
      atualizar((f) => ({
        ...f,
        treinos: f.treinos.map((t) =>
          t.id === treinoId ? { ...t, itens: t.itens.filter((i) => i.itemId !== itemId) } : t,
        ),
      }))
    },
    [atualizar],
  )

  const moverItem = useCallback(
    (treinoId: string, itemId: string, direcao: -1 | 1) => {
      atualizar((f) => ({
        ...f,
        treinos: f.treinos.map((t) => {
          if (t.id !== treinoId) return t
          const idx = t.itens.findIndex((i) => i.itemId === itemId)
          const destino = idx + direcao
          if (idx < 0 || destino < 0 || destino >= t.itens.length) return t
          const itens = [...t.itens]
          ;[itens[idx], itens[destino]] = [itens[destino], itens[idx]]
          return { ...t, itens }
        }),
      }))
    },
    [atualizar],
  )

  const renomearTreino = useCallback(
    (treinoId: string, nome: string) => {
      atualizar((f) => ({
        ...f,
        treinos: f.treinos.map((t) => (t.id === treinoId ? { ...t, nome } : t)),
      }))
    },
    [atualizar],
  )

  const adicionarTreino = useCallback(() => {
    const id = novoId()
    atualizar((f) => ({
      ...f,
      treinos: [
        ...f.treinos,
        { id, nome: `Treino ${String.fromCharCode(65 + f.treinos.length)}`, itens: [] },
      ],
    }))
    setTreinoAtivoId(id)
  }, [atualizar])

  // O updater do useState precisa ser puro (roda duas vezes em StrictMode),
  // entao a troca de aba ativa e decidida aqui fora, com o estado corrente.
  const removerTreino = useCallback(
    (treinoId: string) => {
      if (ficha.treinos.length <= 1) return
      const restantes = ficha.treinos.filter((t) => t.id !== treinoId)
      atualizar((f) => ({ ...f, treinos: f.treinos.filter((t) => t.id !== treinoId) }))
      setTreinoAtivoId((atual) => (atual === treinoId ? restantes[0].id : atual))
    },
    [atualizar, ficha.treinos],
  )

  const limparTudo = useCallback(() => {
    const nova = fichaInicial()
    setFicha(nova)
    setTreinoAtivoId(nova.treinos[0].id)
  }, [])

  const totalExercicios = useMemo(
    () => ficha.treinos.reduce((soma, t) => soma + t.itens.length, 0),
    [ficha.treinos],
  )

  return {
    ficha,
    treinoAtivo,
    treinoAtivoId: treinoAtivo?.id ?? '',
    setTreinoAtivoId,
    totalExercicios,
    adicionarExercicio,
    editarItem,
    removerItem,
    moverItem,
    renomearTreino,
    adicionarTreino,
    removerTreino,
    limparTudo,
  }
}
