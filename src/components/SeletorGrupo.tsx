import { GRUPOS, type GrupoId } from '@/types'

interface Props {
  ativo: GrupoId
  onChange: (grupo: GrupoId) => void
}

export function SeletorGrupo({ ativo, onChange }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2">
        {GRUPOS.map((g) => {
          const selecionado = g.id === ativo
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange(g.id)}
              aria-pressed={selecionado}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                selecionado
                  ? 'bg-acento text-base-900'
                  : 'border border-white/10 bg-base-800 text-zinc-300 hover:border-white/25'
              }`}
            >
              {g.nome}
            </button>
          )
        })}
      </div>
    </div>
  )
}
