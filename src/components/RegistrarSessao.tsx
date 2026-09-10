import { useEffect, useMemo, useState } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import type { RegistroExercicio, Treino } from '@/types'
import { hojeISO } from '@/lib/historico'
import { ExercicioImagem } from './ExercicioImagem'

interface Props {
  treinos: Treino[]
  ultimasCargas: Map<string, number[]>
  onSalvar: (dados: {
    data: string
    treinoId: string
    treinoNome: string
    registros: RegistroExercicio[]
  }) => string | null
}

type Rascunho = Record<string, { peso: string; reps: string }[]>

/**
 * Os exercicios vem da ficha que ja esta no app — nao ha nada a "importar" do PDF,
 * que e apenas uma saida gerada a partir dos mesmos dados.
 */
export function RegistrarSessao({ treinos, ultimasCargas, onSalvar }: Props) {
  const comExercicios = useMemo(() => treinos.filter((t) => t.itens.length > 0), [treinos])

  const [treinoId, setTreinoId] = useState(() => comExercicios[0]?.id ?? '')
  const [data, setData] = useState(hojeISO)
  const [rascunho, setRascunho] = useState<Rascunho>({})
  const [salvo, setSalvo] = useState(false)

  const treino = comExercicios.find((t) => t.id === treinoId) ?? comExercicios[0]

  // se o treino selecionado sumiu (excluido ou esvaziado), cai no primeiro disponivel
  useEffect(() => {
    if (comExercicios.length === 0) return
    if (!comExercicios.some((t) => t.id === treinoId)) setTreinoId(comExercicios[0].id)
  }, [comExercicios, treinoId])

  /**
   * Monta o formulario com a carga da ultima vez ja preenchida e as reps vindas
   * da ficha. Na maioria dos dias o registro vira conferir e salvar.
   */
  useEffect(() => {
    if (!treino) return

    const inicial: Rascunho = {}
    for (const item of treino.itens) {
      const anteriores = ultimasCargas.get(item.exercicioId) ?? []
      inicial[item.itemId] = Array.from({ length: item.series }, (_, i) => ({
        peso: anteriores[i] != null ? String(anteriores[i]) : '',
        reps: String(item.reps),
      }))
    }
    setRascunho(inicial)
    setSalvo(false)
  }, [treino, ultimasCargas])

  if (comExercicios.length === 0) {
    return (
      <div className="cartao px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-400">Nenhum treino montado ainda</p>
        <p className="mt-1 text-xs text-zinc-600">
          Volte na aba Ficha, adicione exercícios e eles aparecem aqui para registrar.
        </p>
      </div>
    )
  }

  function alterar(itemId: string, indice: number, campo: 'peso' | 'reps', valor: string) {
    setRascunho((atual) => {
      const series = [...(atual[itemId] ?? [])]
      series[indice] = { ...series[indice], [campo]: valor }
      return { ...atual, [itemId]: series }
    })
    setSalvo(false)
  }

  /** copia o peso da primeira série para as demais — o caso mais comum na academia */
  function repetirPrimeira(itemId: string) {
    setRascunho((atual) => {
      const series = atual[itemId] ?? []
      const primeiro = series[0]?.peso ?? ''
      return { ...atual, [itemId]: series.map((s) => ({ ...s, peso: primeiro })) }
    })
    setSalvo(false)
  }

  const preenchidos = useMemo(
    () =>
      Object.values(rascunho).filter((series) =>
        series.some((s) => Number.parseFloat(s.peso) > 0),
      ).length,
    [rascunho],
  )

  function salvar() {
    if (!treino) return

    const registros: RegistroExercicio[] = treino.itens.map((item) => ({
      exercicioId: item.exercicioId,
      nome: item.nome,
      grupo: item.grupo,
      series: (rascunho[item.itemId] ?? []).map((s) => ({
        peso: Number.parseFloat(s.peso.replace(',', '.')) || 0,
        reps: Number.parseInt(s.reps, 10) || 0,
      })),
    }))

    const id = onSalvar({
      data,
      treinoId: treino.id,
      treinoNome: treino.nome,
      registros,
    })

    if (id) {
      setSalvo(true)
      window.setTimeout(() => setSalvo(false), 2500)
    }
  }

  return (
    <section className="cartao p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Treino
          </label>
          <select
            className="campo appearance-none py-2 text-sm"
            value={treino?.id ?? ''}
            onChange={(e) => setTreinoId(e.target.value)}
          >
            {comExercicios.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Data
          </label>
          <input
            type="date"
            className="campo py-2 text-sm"
            value={data}
            max={hojeISO()}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {treino?.itens.map((item) => (
          <li key={item.itemId} className="rounded-xl border border-white/5 bg-base-700/40 p-3">
            <div className="flex items-center gap-2.5">
              <ExercicioImagem
                src={item.imagem}
                alt={item.nome}
                className="h-11 w-11 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold leading-tight">{item.nome}</h4>
                <p className="text-[11px] text-zinc-500">
                  meta: {item.series} × {item.reps}
                  {item.carga && ` · ${item.carga}`}
                </p>
              </div>
              {(rascunho[item.itemId]?.length ?? 0) > 1 && (
                <button
                  type="button"
                  onClick={() => repetirPrimeira(item.itemId)}
                  title="Repetir o peso da 1ª série nas demais"
                  className="botao-fantasma shrink-0"
                >
                  <RotateCcw className="h-3 w-3" /> Igualar
                </button>
              )}
            </div>

            <div className="mt-2.5 space-y-1.5">
              {(rascunho[item.itemId] ?? []).map((serie, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 text-[11px] font-semibold uppercase text-zinc-500">
                    {i + 1}ª
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="peso"
                      className="campo py-1.5 pr-8 text-center text-sm font-bold"
                      value={serie.peso}
                      onChange={(e) => alterar(item.itemId, i, 'peso', e.target.value)}
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600">
                      kg
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-600">×</span>
                  <div className="relative w-20">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="reps"
                      className="campo py-1.5 text-center text-sm"
                      value={serie.reps}
                      onChange={(e) => alterar(item.itemId, i, 'reps', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={salvar}
        disabled={preenchidos === 0}
        className="botao-primario mt-4"
      >
        {salvo ? (
          <>
            <Check className="h-5 w-5" strokeWidth={2.5} /> Registrado!
          </>
        ) : (
          <>
            <Save className="h-5 w-5" strokeWidth={2.25} />
            {preenchidos === 0
              ? 'Preencha ao menos um peso'
              : `Salvar ${preenchidos} ${preenchidos === 1 ? 'exercício' : 'exercícios'}`}
          </>
        )}
      </button>

      <p className="mt-2 text-center text-[11px] text-zinc-600">
        Salvar de novo no mesmo dia e treino cria um registro novo — dá para apagar no
        histórico abaixo.
      </p>
    </section>
  )
}
