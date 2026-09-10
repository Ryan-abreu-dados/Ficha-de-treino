import { NIVEIS, ORDEM_NIVEL, type Nivel } from '@/types'

interface Props {
  ativo: Nivel | null
  onChange: (nivel: Nivel | null) => void
  contagem: Record<Nivel, number>
}

/**
 * O filtro e cumulativo: escolher "Intermediario" mostra tambem os de iniciante.
 * Exercicio basico nao deixa de servir quando a pessoa evolui — o que muda com o
 * nivel do praticante e volume e divisao, nao o cardapio.
 */
export function SeletorNivel({ ativo, onChange, contagem }: Props) {
  const total = NIVEIS.reduce((soma, n) => soma + contagem[n.id], 0)

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="mr-0.5 shrink-0 font-semibold uppercase tracking-wide text-zinc-600">
        Nível
      </span>

      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={ativo === null}
        className={`rounded-lg px-2.5 py-1 font-medium transition active:scale-95 ${
          ativo === null
            ? 'bg-base-600 text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Todos <span className="text-zinc-600">{total}</span>
      </button>

      {NIVEIS.map((n) => {
        const quantos = NIVEIS.filter(
          (x) => ORDEM_NIVEL[x.id] <= ORDEM_NIVEL[n.id],
        ).reduce((soma, x) => soma + contagem[x.id], 0)

        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onChange(n.id)}
            aria-pressed={ativo === n.id}
            title={`${n.nome} — mostra ${quantos} exercícios`}
            className={`rounded-lg px-2.5 py-1 font-medium transition active:scale-95 ${
              ativo === n.id
                ? 'bg-acento text-base-900'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {n.nome}
          </button>
        )
      })}
    </div>
  )
}
