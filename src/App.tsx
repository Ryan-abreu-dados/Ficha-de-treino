import { useState } from 'react'
import { Download, Dumbbell, FileDown, RotateCcw } from 'lucide-react'
import type { GrupoId } from '@/types'
import { useFicha } from '@/hooks/useFicha'
import { exportarFicha } from '@/lib/storage'
import { SeletorGrupo } from '@/components/SeletorGrupo'
import { PainelExercicio } from '@/components/PainelExercicio'
import { AbasTreino } from '@/components/AbasTreino'
import { ListaFicha } from '@/components/ListaFicha'
import { FichaImprimivel } from '@/components/FichaImprimivel'

export default function App() {
  const [grupo, setGrupo] = useState<GrupoId>('peito')
  const [confirmandoReset, setConfirmandoReset] = useState(false)

  const {
    ficha,
    treinoAtivo,
    treinoAtivoId,
    setTreinoAtivoId,
    totalExercicios,
    adicionarExercicio,
    editarItem,
    removerItem,
    moverItem,
    renomearTreino,
    adicionarTreino,
    removerTreino,
    limparTudo,
  } = useFicha()

  return (
    <>
    <div className="sem-impressao mx-auto min-h-dvh w-full max-w-lg px-4 pb-16 pt-6 lg:max-w-5xl">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-acento/15 p-2 text-acento">
            <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold leading-none tracking-tight">
              Ficha do Ryan
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              {totalExercicios} {totalExercicios === 1 ? 'exercício' : 'exercícios'} em{' '}
              {ficha.treinos.length} {ficha.treinos.length === 1 ? 'treino' : 'treinos'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="botao-fantasma border-acento/40 text-acento"
          >
            <FileDown className="h-3.5 w-3.5" /> PDF
          </button>
          <button
            type="button"
            onClick={() => exportarFicha(ficha)}
            aria-label="Baixar backup em JSON"
            title="Backup em JSON (o PDF não dá pra reimportar)"
            className="botao-fantasma"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          {confirmandoReset ? (
            <>
              <button
                type="button"
                onClick={() => {
                  limparTudo()
                  setConfirmandoReset(false)
                }}
                className="botao-fantasma border-red-500/40 text-red-400"
              >
                Apagar tudo
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoReset(false)}
                className="botao-fantasma"
              >
                Não
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmandoReset(true)}
              aria-label="Zerar ficha"
              className="botao-fantasma"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-6">
          <SeletorGrupo ativo={grupo} onChange={setGrupo} />
          <PainelExercicio
            grupo={grupo}
            nomeTreinoDestino={treinoAtivo?.nome ?? 'treino'}
            onAdicionar={(exercicio, series, reps) =>
              adicionarExercicio(treinoAtivoId, exercicio, series, reps)
            }
          />
        </div>

        <div className="space-y-4">
          <AbasTreino
            treinos={ficha.treinos}
            ativoId={treinoAtivoId}
            onSelecionar={setTreinoAtivoId}
            onAdicionar={adicionarTreino}
            onRenomear={renomearTreino}
            onRemover={removerTreino}
          />

          {treinoAtivo && (
            <ListaFicha
              treino={treinoAtivo}
              onEditar={(itemId, campos) => editarItem(treinoAtivoId, itemId, campos)}
              onRemover={(itemId) => removerItem(treinoAtivoId, itemId)}
              onMover={(itemId, dir) => moverItem(treinoAtivoId, itemId, dir)}
            />
          )}
        </div>
      </div>

      <footer className="mt-10 text-center text-[11px] leading-relaxed text-zinc-600">
        Tudo fica salvo no seu navegador. Limpar os dados do site apaga a ficha —
        o botão <strong className="font-semibold text-zinc-500">PDF</strong> gera a
        ficha pra levar na academia e o de download guarda o backup em JSON.
      </footer>
    </div>

    <FichaImprimivel ficha={ficha} />
    </>
  )
}
