import { ClipboardList } from 'lucide-react'
import type { ItemFicha, Treino } from '@/types'
import { ItemFichaCard } from './ItemFichaCard'

interface Props {
  treino: Treino
  onEditar: (itemId: string, campos: Partial<ItemFicha>) => void
  onRemover: (itemId: string) => void
  onMover: (itemId: string, direcao: -1 | 1) => void
}

export function ListaFicha({ treino, onEditar, onRemover, onMover }: Props) {
  const totalSeries = treino.itens.reduce((s, i) => s + i.series, 0)

  if (treino.itens.length === 0) {
    return (
      <div className="cartao flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        <ClipboardList className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
        <p className="text-sm font-medium text-zinc-400">{treino.nome} está vazio</p>
        <p className="text-xs text-zinc-600">
          Escolha o grupo muscular acima e adicione o primeiro exercício.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
        <span>
          {treino.itens.length}{' '}
          {treino.itens.length === 1 ? 'exercício' : 'exercícios'}
        </span>
        <span>{totalSeries} séries no total</span>
      </div>

      <ul className="space-y-3">
        {treino.itens.map((item, i) => (
          <ItemFichaCard
            key={item.itemId}
            item={item}
            indice={i}
            primeiro={i === 0}
            ultimo={i === treino.itens.length - 1}
            onEditar={(campos) => onEditar(item.itemId, campos)}
            onRemover={() => onRemover(item.itemId)}
            onMover={(dir) => onMover(item.itemId, dir)}
          />
        ))}
      </ul>
    </div>
  )
}
