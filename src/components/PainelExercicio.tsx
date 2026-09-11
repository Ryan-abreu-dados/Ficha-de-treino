import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Loader2, Plus, Search, X } from 'lucide-react'
import { NIVEIS, ORDEM_NIVEL, type Exercicio, type GrupoId, type Nivel } from '@/types'
import { SeletorNivel } from './SeletorNivel'
import { fonteExercicios } from '@/services/exercicios'
import { ExercicioImagem } from './ExercicioImagem'
import { CampoNumero } from './CampoNumero'

interface Props {
  grupo: GrupoId
  nivel: Nivel | null
  onNivel: (n: Nivel | null) => void
  nomeTreinoDestino: string
  onAdicionar: (exercicio: Exercicio, series: number, reps: number) => void
}

export function PainelExercicio({
  grupo,
  nivel,
  onNivel,
  nomeTreinoDestino,
  onAdicionar,
}: Props) {
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionadoId, setSelecionadoId] = useState<string>('')
  const [busca, setBusca] = useState('')
  const [series, setSeries] = useState(3)
  const [reps, setReps] = useState(12)
  const [confirmado, setConfirmado] = useState(false)
  const [criandoManual, setCriandoManual] = useState(false)
  const [nomeManual, setNomeManual] = useState('')

  // Busca por grupo. `cancelado` evita que uma resposta lenta de um grupo
  // anterior sobrescreva a lista do grupo que o usuario ja selecionou.
  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro(null)
    setBusca('')
    setCriandoManual(false)
    setNomeManual('')

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

  const contagem = useMemo(() => {
    const base = { iniciante: 0, intermediario: 0, avancado: 0 } as Record<Nivel, number>
    for (const e of exercicios) base[e.nivel]++
    return base
  }, [exercicios])

  // filtro de nivel e cumulativo: "intermediario" inclui os de iniciante
  const doNivel = useMemo(() => {
    if (!nivel) return exercicios
    return exercicios.filter((e) => ORDEM_NIVEL[e.nivel] <= ORDEM_NIVEL[nivel])
  }, [exercicios, nivel])

  // busca sem acento e sem caixa, no nome PT e tambem no nome original em ingles
  const filtrados = useMemo(() => {
    const termo = normalizar(busca)
    if (!termo) return doNivel
    return doNivel.filter(
      (e) =>
        normalizar(e.nome).includes(termo) ||
        normalizar(e.nomeOriginal ?? '').includes(termo),
    )
  }, [doNivel, busca])

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

  function adicionarManual() {
    const nome = nomeManual.trim()
    if (!nome) return

    // id derivado do nome (nao aleatorio): recriar "Cadeira adutora" outro dia
    // cai no mesmo id, entao a Progressao acumula historico em vez de tratar
    // cada adicao manual como um exercicio novo
    const slug = normalizar(nome)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '')

    const exercicio: Exercicio = {
      id: `manual-${grupo}-${slug || Date.now()}`,
      nome,
      grupo,
      nivel: 'intermediario',
      imagem: null,
      fonte: 'manual',
    }

    onAdicionar(exercicio, series, reps)
    setConfirmado(true)
    window.setTimeout(() => setConfirmado(false), 1400)
    setNomeManual('')
    setCriandoManual(false)
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
          <div className="mb-2.5 -mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SeletorNivel ativo={nivel} onChange={onNivel} contagem={contagem} />
          </div>

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
              className="campo py-2 pl-9 pr-9 text-base"
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
              {busca
                ? `Nada encontrado para "${busca}".`
                : `Nenhum exercício de ${NIVEIS.find((n) => n.id === nivel)?.nome.toLowerCase()} para baixo neste grupo.`}
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

          {!criandoManual && (
            <button
              type="button"
              onClick={() => setCriandoManual(true)}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-acento"
            >
              <Plus className="h-3.5 w-3.5" /> Não achei — criar exercício manual
            </button>
          )}

          {criandoManual ? (
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Nome do exercício
              </label>
              <input
                type="text"
                autoFocus
                value={nomeManual}
                onChange={(e) => setNomeManual(e.target.value)}
                placeholder="ex: Remada na máquina X da minha academia"
                className="campo"
              />
              <p className="mt-1.5 text-xs text-zinc-600">
                Sem foto — fica só com esse nome na sua ficha e no PDF.
              </p>
            </div>
          ) : (
            selecionado && (
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
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-acento/15 px-2 py-0.5 text-xs font-semibold text-acento">
                    {NIVEIS.find((n) => n.id === selecionado.nivel)?.nome}
                  </span>
                  {selecionado.equipamento && (
                    <span className="rounded-md bg-base-700 px-2 py-0.5 text-xs text-zinc-400">
                      {selecionado.equipamento}
                    </span>
                  )}
                </div>
                {selecionado.instrucoes && (
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-zinc-400">
                    {selecionado.instrucoes}
                  </p>
                )}
              </>
            )
          )}

          {(criandoManual || selecionado) && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Séries
                  </label>
                  <CampoNumero
                    valor={series}
                    onChange={setSeries}
                    className="campo text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Repetições
                  </label>
                  <CampoNumero
                    valor={reps}
                    onChange={setReps}
                    className="campo text-center text-lg font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={criandoManual ? adicionarManual : adicionar}
                disabled={criandoManual && !nomeManual.trim()}
                className="botao-primario mt-4"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                {confirmado
                  ? 'Adicionado!'
                  : criandoManual
                    ? 'Adicionar exercício manual'
                    : `Adicionar ao ${nomeTreinoDestino}`}
              </button>

              {criandoManual && (
                <button
                  type="button"
                  onClick={() => {
                    setCriandoManual(false)
                    setNomeManual('')
                  }}
                  className="mt-2 w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-300"
                >
                  Cancelar
                </button>
              )}
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

