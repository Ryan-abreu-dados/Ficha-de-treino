import { useState } from 'react'
import { ChevronDown, ChevronUp, Check, Pencil, Trash2, X } from 'lucide-react'
import type { ItemFicha } from '@/types'
import { NOME_GRUPO } from '@/types'
import { ExercicioImagem } from './ExercicioImagem'
import { CampoNumero } from './CampoNumero'

interface Props {
  item: ItemFicha
  indice: number
  primeiro: boolean
  ultimo: boolean
  onEditar: (campos: Partial<ItemFicha>) => void
  onRemover: () => void
  onMover: (direcao: -1 | 1) => void
}

export function ItemFichaCard({
  item,
  indice,
  primeiro,
  ultimo,
  onEditar,
  onRemover,
  onMover,
}: Props) {
  const [editando, setEditando] = useState(false)
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false)
  const [rascunho, setRascunho] = useState({
    series: item.series,
    reps: item.reps,
    carga: item.carga,
    obs: item.obs,
  })

  function abrirEdicao() {
    setRascunho({ series: item.series, reps: item.reps, carga: item.carga, obs: item.obs })
    setEditando(true)
  }

  function salvar() {
    onEditar(rascunho)
    setEditando(false)
  }

  return (
    <li className="cartao overflow-hidden">
      <div className="flex gap-3 p-3">
        <ExercicioImagem
          src={item.imagem}
          alt={item.nome}
          className="h-20 w-20 shrink-0 rounded-lg"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 rounded-md bg-base-700 px-1.5 py-0.5 text-[11px] font-bold text-zinc-400">
              {indice + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold leading-tight">{item.nome}</h4>
              {item.nomeOriginal && item.nomeOriginal !== item.nome && (
                <p className="truncate text-xs italic text-zinc-600">{item.nomeOriginal}</p>
              )}
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                {NOME_GRUPO[item.grupo]}
              </p>
            </div>
          </div>

          {!editando && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-lg bg-acento/15 px-2 py-1 text-xs font-bold text-acento">
                {item.series} × {item.reps}
              </span>
              {item.carga && (
                <span className="rounded-lg bg-base-700 px-2 py-1 text-xs font-medium text-zinc-300">
                  {item.carga}
                </span>
              )}
            </div>
          )}
        </div>

        {!editando && (
          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => onMover(-1)}
              disabled={primeiro}
              aria-label="Subir exercício"
              className="botao-fantasma px-1.5 py-1"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMover(1)}
              disabled={ultimo}
              aria-label="Descer exercício"
              className="botao-fantasma px-1.5 py-1"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <div className="border-t border-white/5 bg-base-700/40 p-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Séries
              </label>
              <CampoNumero
                valor={rascunho.series}
                onChange={(v) => setRascunho((r) => ({ ...r, series: v }))}
                className="campo px-2 py-2 text-center text-sm font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Reps
              </label>
              <CampoNumero
                valor={rascunho.reps}
                onChange={(v) => setRascunho((r) => ({ ...r, reps: v }))}
                className="campo px-2 py-2 text-center text-sm font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Carga
              </label>
              <input
                type="text"
                placeholder="20 kg"
                className="campo px-2 py-2 text-center text-sm"
                value={rascunho.carga}
                onChange={(e) => setRascunho((r) => ({ ...r, carga: e.target.value }))}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Observação (cadência, drop-set, dor...)"
            className="campo mt-2 py-2 text-sm"
            value={rascunho.obs}
            onChange={(e) => setRascunho((r) => ({ ...r, obs: e.target.value }))}
          />

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={salvar}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-acento py-2 text-sm font-semibold text-base-900 active:scale-[0.98]"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} /> Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 active:scale-95"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 border-t border-white/5 px-3 py-2">
          <p className="min-w-0 flex-1 truncate text-xs italic text-zinc-500">
            {item.obs || '\u00a0'}
          </p>
          <div className="flex shrink-0 gap-1.5">
            <button type="button" onClick={abrirEdicao} className="botao-fantasma">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            {confirmandoRemocao ? (
              <>
                <button
                  type="button"
                  onClick={onRemover}
                  className="botao-fantasma border-red-500/40 text-red-400"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoRemocao(false)}
                  className="botao-fantasma"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoRemocao(true)}
                aria-label="Excluir exercício"
                className="botao-fantasma text-zinc-400 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

