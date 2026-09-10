import { useState } from 'react'
import { CalendarDays, LineChart, Minus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import type { Sessao } from '@/types'
import type { EvolucaoExercicio } from '@/hooks/useHistorico'
import { formatarData, volumeDoRegistro } from '@/lib/historico'

interface Props {
  evolucao: EvolucaoExercicio[]
  sessoes: Sessao[]
  onRemoverSessao: (id: string) => void
}

export function PainelEvolucao({ evolucao, sessoes, onRemoverSessao }: Props) {
  if (sessoes.length === 0) {
    return (
      <div className="cartao flex flex-col items-center gap-2 px-6 py-10 text-center">
        <LineChart className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
        <p className="text-sm font-medium text-zinc-400">Nenhum treino registrado ainda</p>
        <p className="text-xs leading-relaxed text-zinc-600">
          Preencha os pesos acima e salve. A partir do segundo registro do mesmo
          exercício, a evolução aparece aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Evolução por exercício
        </h3>
        <ul className="space-y-2">
          {evolucao.map((e) => (
            <CartaoEvolucao key={e.exercicioId} evolucao={e} />
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Treinos registrados ({sessoes.length})
        </h3>
        <ul className="space-y-2">
          {sessoes.map((s) => (
            <LinhaSessao key={s.id} sessao={s} onRemover={() => onRemoverSessao(s.id)} />
          ))}
        </ul>
      </section>
    </div>
  )
}

function CartaoEvolucao({ evolucao }: { evolucao: EvolucaoExercicio }) {
  const { nome, sessoes, pontos, variacao, maiorCarga, ultimoVolume } = evolucao
  const subiu = variacao > 1
  const caiu = variacao < -1
  const Icone = subiu ? TrendingUp : caiu ? TrendingDown : Minus
  const cor = subiu ? 'text-acento' : caiu ? 'text-amber-400' : 'text-zinc-500'

  return (
    <li className="cartao p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 text-sm font-semibold leading-tight">{nome}</h4>
        {sessoes > 1 ? (
          <span className={`flex shrink-0 items-center gap-1 text-sm font-bold ${cor}`}>
            <Icone className="h-3.5 w-3.5" strokeWidth={2.5} />
            {variacao > 0 ? '+' : ''}
            {variacao.toFixed(0)}%
          </span>
        ) : (
          <span className="shrink-0 text-[11px] text-zinc-600">1º registro</span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
        <span>
          {sessoes} {sessoes === 1 ? 'sessão' : 'sessões'}
        </span>
        <span>
          maior carga <strong className="font-semibold text-zinc-300">{maiorCarga} kg</strong>
        </span>
        <span>
          último volume{' '}
          <strong className="font-semibold text-zinc-300">
            {ultimoVolume.toLocaleString('pt-BR')} kg
          </strong>
        </span>
      </div>

      {pontos.length > 1 && <Sparkline pontos={pontos} subiu={subiu} caiu={caiu} />}
    </li>
  )
}

/**
 * Barras de volume por sessao. Barra, e nao linha: as sessoes nao sao igualmente
 * espacadas no tempo, e uma linha sugeriria uma continuidade que o dado nao tem.
 */
function Sparkline({
  pontos,
  subiu,
  caiu,
}: {
  pontos: { data: string; volume: number }[]
  subiu: boolean
  caiu: boolean
}) {
  const visiveis = pontos.slice(-12)
  const maximo = Math.max(...visiveis.map((p) => p.volume), 1)
  const cor = subiu ? 'bg-acento' : caiu ? 'bg-amber-400' : 'bg-zinc-500'

  return (
    <div className="mt-2.5">
      <div className="flex h-12 items-end gap-1">
        {visiveis.map((p, i) => (
          <div
            key={`${p.data}-${i}`}
            title={`${formatarData(p.data)}: ${p.volume.toLocaleString('pt-BR')} kg de volume`}
            className="flex-1"
          >
            <div
              className={`w-full rounded-sm ${cor} ${i === visiveis.length - 1 ? 'opacity-100' : 'opacity-40'}`}
              // altura minima de 4% pra que sessao muito leve ainda apareca
              style={{ height: `${Math.max(4, (p.volume / maximo) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
        <span>{formatarData(visiveis[0].data)}</span>
        <span>{formatarData(visiveis[visiveis.length - 1].data)}</span>
      </div>
    </div>
  )
}

function LinhaSessao({ sessao, onRemover }: { sessao: Sessao; onRemover: () => void }) {
  const [confirmando, setConfirmando] = useState(false)
  const [aberto, setAberto] = useState(false)

  const volumeTotal = sessao.registros.reduce((s, r) => s + volumeDoRegistro(r.series), 0)

  return (
    <li className="cartao overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
            <span className="text-sm font-semibold">{formatarData(sessao.data)}</span>
            <span className="truncate text-xs text-zinc-500">{sessao.treinoNome}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {sessao.registros.length}{' '}
            {sessao.registros.length === 1 ? 'exercício' : 'exercícios'} ·{' '}
            {volumeTotal.toLocaleString('pt-BR')} kg de volume
          </p>
        </button>

        {confirmando ? (
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={onRemover}
              className="botao-fantasma border-red-500/40 text-red-400"
            >
              Apagar
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="botao-fantasma"
            >
              Não
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            aria-label="Apagar registro"
            className="botao-fantasma shrink-0 text-zinc-500 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {aberto && (
        <ul className="border-t border-white/5 bg-base-700/30 px-3 py-2">
          {sessao.registros.map((r) => (
            <li key={r.exercicioId} className="py-1 text-xs">
              <span className="text-zinc-300">{r.nome}</span>
              <span className="ml-2 text-zinc-500">
                {r.series.map((s) => `${s.peso}×${s.reps}`).join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
