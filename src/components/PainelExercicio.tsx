import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Loader2, Plus, Search, X } from 'lucide-react'
import type { Exercicio, GrupoId } from '@/types'
import { fonteExercicios } from '@/services/exercicios'
import { ExercicioImagem } from './ExercicioImagem'

interface Props {
  grupo: GrupoId
  nomeTreinoDestino: string
  onAdicionar: (exercicio: Exercicio, series: number, reps: number) => void
}

export function PainelExercicio({ grupo, nomeTreinoDestino, onAdicionar }: Props) {
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionadoId, setSelecionadoId] = useState<string>('')
  const [busca, setBusca] = useState('')
  const [series, setSeries] = useState(3)
  const [reps, setReps] = useState(12)
  const [confirmado, setConfirmado] = useState(false)

  // Busca por grupo. `cancelado` evita que uma resposta lenta de um grupo
  // anterior sobrescreva a lista do grupo que o usuario ja selecionou.
  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro(null)
    setBusca('')

    fonteExercicios
      .listarExercicios(grupo)
      .then((lista) => {
        if (cancelado) return
        setExercicios(lista)
        setSelecionadoId(lista[0]?.id ?? '')
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setExercicios([])
        setErro(e instanceof Error ? e.message : 'Falha ao buscar exercícios')
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [grupo])

  // busca sem acento e sem caixa, no nome PT e tambem no nome original em ingles
  const filtrados = useMemo(() => {
    const termo = normalizar(busca)
    if (!termo) return exercicios
    return exercicios.filter(
      (e) =>
        normalizar(e.nome).includes(termo) ||
        normalizar(e.nomeOriginal ?? '').includes(termo),
    )
  }, [exercicios, busca])

  // se a busca eliminou o exercicio que estava selecionado, cai no primeiro da lista
  useEffect(() => {
    if (filtrados.length === 0) return
    if (!filtrados.some((e) => e.id === selecionadoId)) setSelecionadoId(filtrados[0].id)
  }, [filtrados, selecionadoId])

  const selecionado = useMemo(
    () => exercicios.find((e) => e.id === selecionadoId) ?? null,
    [exercicios, selecionadoId],
  )

  function adicionar() {
    if (!selecionado) return
    onAdicionar(selecionado, series, reps)
    setConfirmado(true)
    window.setTimeout(() => setConfirmado(false), 1400)
  }

  return (
    <section className="cartao p-4">
      {carregando ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : erro ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-amber-400">
          <AlertTriangle className="h-6 w-6" />
          <p>Não consegui carregar os exercícios.</p>
          <p className="text-xs text-zinc-500">{erro}</p>
        </div>
      ) : exercicios.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
          Nenhum exercício para esse grupo.
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Exercício
            </label>
            <span className="text-xs text-zinc-600">
              {filtrados.length} de {exercicios.length}
            </span>
          </div>

          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar exercício..."
              className="campo py-2 pl-9 pr-9 text-sm"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {filtrados.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-base-700/50 px-3 py-2.5 text-sm text-zinc-500">
              Nada encontrado para "{busca}".
            </p>
          ) : (
            <select
              className="campo appearance-none"
              value={selecionadoId}
              onChange={(e) => setSelecionadoId(e.target.value)}
            >
              {filtrados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
          )}

          {selecionado && (
            <>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
                <ExercicioImagem
                  src={selecionado.imagem}
                  alt={selecionado.nome}
                  className="h-56 w-full sm:h-72"
                />
              </div>

              <h3 className="mt-3 text-lg font-bold leading-tight">{selecionado.nome}</h3>
              {selecionado.nomeOriginal && selecionado.nomeOriginal !== selecionado.nome && (
                <p className="mt-0.5 text-sm italic text-zinc-500">
                  {selecionado.nomeOriginal}
                </p>
              )}
              {selecionado.equipamento && (
                <p className="mt-1.5 inline-block rounded-md bg-base-700 px-2 py-0.5 text-xs text-zinc-400">
                  {selecionado.equipamento}
                </p>
              )}
              {selecionado.instrucoes && (
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-zinc-400">
                  {selecionado.instrucoes}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Séries
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    className="campo text-center text-lg font-bold"
                    value={series}
                    onChange={(e) => setSeries(limitar(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Repetições
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    className="campo text-center text-lg font-bold"
                    value={reps}
                    onChange={(e) => setReps(limitar(e.target.value))}
                  />
                </div>
              </div>

              <button type="button" onClick={adicionar} className="botao-primario mt-4">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                {confirmado ? 'Adicionado!' : `Adicionar ao ${nomeTreinoDestino}`}
              </button>
            </>
          )}
        </>
      )}
    </section>
  )
}

/** tira acento e caixa pra que "triceps" ache "Tríceps" */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** so impede zero e negativo — nao existe teto de series nem de repeticoes */
function limitar(valor: string): number {
  const n = Number.parseInt(valor, 10)
  if (Number.isNaN(n) || n < 1) return 1
  return n
}
