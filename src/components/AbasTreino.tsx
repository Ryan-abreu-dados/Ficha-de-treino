import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import type { Treino } from '@/types'

interface Props {
  treinos: Treino[]
  ativoId: string
  onSelecionar: (id: string) => void
  onAdicionar: () => void
  onRenomear: (id: string, nome: string) => void
  onRemover: (id: string) => void
}

export function AbasTreino({
  treinos,
  ativoId,
  onSelecionar,
  onAdicionar,
  onRenomear,
  onRemover,
}: Props) {
  const [renomeandoId, setRenomeandoId] = useState<string | null>(null)
  const [rascunho, setRascunho] = useState('')

  function confirmarRenome(id: string) {
    const nome = rascunho.trim()
    if (nome) onRenomear(id, nome)
    setRenomeandoId(null)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="-mx-4 flex-1 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2">
          {treinos.map((t) => {
            const ativo = t.id === ativoId

            if (renomeandoId === t.id) {
              return (
                <div key={t.id} className="flex shrink-0 items-center gap-1">
                  <input
                    autoFocus
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmarRenome(t.id)
                      if (e.key === 'Escape') setRenomeandoId(null)
                    }}
                    className="w-32 rounded-lg border border-acento/50 bg-base-700 px-2 py-1.5 text-base outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => confirmarRenome(t.id)}
                    aria-label="Confirmar nome"
                    className="rounded-lg bg-acento p-1.5 text-base-900"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </div>
              )
            }

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  // segundo toque na aba ja ativa abre a renomeacao — evita um botao a mais
                  if (ativo) {
                    setRascunho(t.nome)
                    setRenomeandoId(t.id)
                  } else {
                    onSelecionar(t.id)
                  }
                }}
                className={`group flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                  ativo
                    ? 'bg-base-700 text-zinc-100 ring-1 ring-acento/40'
                    : 'bg-base-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.nome}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    ativo ? 'bg-acento/20 text-acento' : 'bg-white/5 text-zinc-500'
                  }`}
                >
                  {t.itens.length}
                </span>
                {ativo && treinos.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Excluir ${t.nome}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemover(t.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation()
                        onRemover(t.id)
                      }
                    }}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onAdicionar}
        aria-label="Novo treino"
        className="shrink-0 rounded-xl border border-dashed border-white/15 p-2.5 text-zinc-400 transition hover:border-acento/50 hover:text-acento active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
