import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CalendarDays, ChevronDown, Sparkles, X } from 'lucide-react'
import { COMBOS, type Combo } from '@/data/combos'
import { fonteCatalogo } from '@/services/exercicios'
import { NOME_GRUPO } from '@/types'

interface Props {
  aberto: boolean
  onFechar: () => void
  /** quantos exercícios existem hoje na ficha, somando todos os treinos */
  exerciciosAtuais: number
  onAplicar: (combo: Combo) => void
}

export function ModalCombos({ aberto, onFechar, exerciciosAtuais, onAplicar }: Props) {
  const [expandido, setExpandido] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState<Combo | null>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Esc sai da confirmacao primeiro, so depois fecha o modal
      if (confirmando) setConfirmando(null)
      else onFechar()
    }
    document.addEventListener('keydown', aoTeclar)

    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fecharRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = anterior
    }
  }, [aberto, confirmando, onFechar])

  useEffect(() => {
    if (!aberto) {
      setExpandido(null)
      setConfirmando(null)
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div
      className="sem-impressao fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onFechar}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-combos"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-base-800 p-5 pb-7 shadow-2xl sm:rounded-3xl sm:pb-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-acento/15 p-2 text-acento">
              <Sparkles className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div>
              <h2 id="titulo-combos" className="text-lg font-extrabold leading-none">
                Fichas prontas
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Escolha uma, ajuste o que quiser e baixe o PDF
              </p>
            </div>
          </div>
          <button
            ref={fecharRef}
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <div className="space-y-3">
            <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Por experiência
            </h3>
            {COMBOS.filter((c) => c.categoria === 'experiencia').map((combo) => (
              <CartaoCombo
                key={combo.id}
                combo={combo}
                expandido={expandido === combo.id}
                onAlternar={() =>
                  setExpandido((atual) => (atual === combo.id ? null : combo.id))
                }
                onUsar={() => setConfirmando(combo)}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Por objetivo
            </h3>
            {COMBOS.filter((c) => c.categoria === 'foco').map((combo) => (
              <CartaoCombo
                key={combo.id}
                combo={combo}
                expandido={expandido === combo.id}
                onAlternar={() =>
                  setExpandido((atual) => (atual === combo.id ? null : combo.id))
                }
                onUsar={() => setConfirmando(combo)}
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-600">
          As divisões e o volume seguem o que é usual para cada fase. Se você treina com
          acompanhamento, o que seu profissional passou vale mais que isto aqui.
        </p>
      </div>

      {confirmando && (
        <ConfirmacaoTroca
          combo={confirmando}
          exerciciosAtuais={exerciciosAtuais}
          onCancelar={() => setConfirmando(null)}
          onConfirmar={() => {
            onAplicar(confirmando)
            setConfirmando(null)
            onFechar()
          }}
        />
      )}
    </div>
  )
}

function CartaoCombo({
  combo,
  expandido,
  onAlternar,
  onUsar,
}: {
  combo: Combo
  expandido: boolean
  onAlternar: () => void
  onUsar: () => void
}) {
  const totalExercicios = combo.treinos.reduce((s, t) => s + t.itens.length, 0)
  const totalSeries = combo.treinos.reduce(
    (s, t) => s + t.itens.reduce((x, i) => x + i.series, 0),
    0,
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-base-700/40">
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-bold">{combo.titulo}</h3>
          <span className="shrink-0 text-[11px] font-medium text-zinc-500">
            {combo.publico}
          </span>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{combo.resumo}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-md bg-base-600 px-2 py-1 text-zinc-300">
            <CalendarDays className="h-3 w-3" /> {combo.frequencia}
          </span>
          <span className="rounded-md bg-base-600 px-2 py-1 text-zinc-300">
            {combo.treinos.length} treinos
          </span>
          <span className="rounded-md bg-base-600 px-2 py-1 text-zinc-300">
            {totalExercicios} exercícios
          </span>
          <span className="rounded-md bg-base-600 px-2 py-1 text-zinc-300">
            {totalSeries} séries
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onUsar}
            className="flex-1 rounded-xl bg-acento py-2.5 text-sm font-semibold text-base-900 transition active:scale-[0.98]"
          >
            Usar esta ficha
          </button>
          <button
            type="button"
            onClick={onAlternar}
            aria-expanded={expandido}
            className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-zinc-300 transition active:scale-95"
          >
            Ver
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandido ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-white/5 bg-base-800/60 p-4">
          {combo.treinos.map((treino) => (
            <div key={treino.nome} className="mb-3 last:mb-0">
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-acento">
                {treino.nome}
              </h4>
              <ul className="space-y-1">
                {treino.itens.map((item, i) => (
                  <ItemPrevia key={`${item.id}-${i}`} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ItemPrevia({
  item,
}: {
  item: { id: string; grupo: string; series: number; reps: number }
}) {
  // resolve o nome de verdade pelo catalogo em vez de repetir texto aqui,
  // senao renomear um exercicio deixaria a previa mentindo
  const exercicio = useMemo(() => fonteCatalogo.acharPorId(item.id, item.grupo), [item])

  return (
    <li className="flex items-baseline justify-between gap-2 text-xs">
      <span className="min-w-0 flex-1 truncate text-zinc-300">
        {exercicio?.nome ?? item.id}
        <span className="ml-1.5 text-[10px] uppercase text-zinc-600">
          {NOME_GRUPO[item.grupo as keyof typeof NOME_GRUPO]}
        </span>
      </span>
      <span className="shrink-0 font-semibold text-zinc-400">
        {item.series} × {item.reps}
      </span>
    </li>
  )
}

function ConfirmacaoTroca({
  combo,
  exerciciosAtuais,
  onCancelar,
  onConfirmar,
}: {
  combo: Combo
  exerciciosAtuais: number
  onCancelar: () => void
  onConfirmar: () => void
}) {
  const temCoisa = exerciciosAtuais > 0

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onCancelar}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-base-800 p-5 shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`rounded-xl p-2 ${temCoisa ? 'bg-amber-500/15 text-amber-400' : 'bg-acento/15 text-acento'}`}
          >
            {temCoisa ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>
          <h3 className="text-base font-bold">Usar a ficha {combo.titulo}?</h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {temCoisa ? (
            <>
              Isso substitui <strong className="text-zinc-200">tudo</strong> que você já
              montou —{' '}
              <strong className="text-zinc-200">
                {exerciciosAtuais}{' '}
                {exerciciosAtuais === 1 ? 'exercício' : 'exercícios'}
              </strong>{' '}
              nos treinos atuais. Não dá para desfazer.
            </>
          ) : (
            <>
              Sua ficha está vazia, então nada se perde. Os {combo.treinos.length} treinos
              entram prontos e você ajusta o que quiser depois.
            </>
          )}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onConfirmar}
            className="flex-1 rounded-xl bg-acento py-2.5 text-sm font-semibold text-base-900 active:scale-[0.98]"
          >
            {temCoisa ? 'Substituir' : 'Usar ficha'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
