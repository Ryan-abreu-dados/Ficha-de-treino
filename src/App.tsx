import { useState } from 'react'
import {
  CircleHelp,
  ClipboardList,
  Download,
  Dumbbell,
  FileDown,
  LineChart,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { GrupoId, Nivel } from '@/types'
import { useFicha } from '@/hooks/useFicha'
import { useHistorico } from '@/hooks/useHistorico'
import { exportarFicha, jaViuApresentacao, marcarApresentacaoVista } from '@/lib/storage'
import { GRUPOS } from '@/types'
import { fonteCatalogo } from '@/services/exercicios'
import { SeletorGrupo } from '@/components/SeletorGrupo'
import { PainelExercicio } from '@/components/PainelExercicio'
import { AbasTreino } from '@/components/AbasTreino'
import { ListaFicha } from '@/components/ListaFicha'
import { FichaImprimivel } from '@/components/FichaImprimivel'
import { ModalBoasVindas } from '@/components/ModalBoasVindas'
import { ModalCombos } from '@/components/ModalCombos'
import { RegistrarSessao } from '@/components/RegistrarSessao'
import { PainelEvolucao } from '@/components/PainelEvolucao'

/** contado do proprio catalogo pra o numero do modal nunca desencontrar do real */
const TOTAL_EXERCICIOS = fonteCatalogo.total

export default function App() {
  const [grupo, setGrupo] = useState<GrupoId>('peito')
  const [nivel, setNivel] = useState<Nivel | null>(null)
  const [confirmandoReset, setConfirmandoReset] = useState(false)
  const [mostrarCombos, setMostrarCombos] = useState(false)
  const [aba, setAba] = useState<'ficha' | 'progressao'>('ficha')
  const [mostrarApresentacao, setMostrarApresentacao] = useState(() => !jaViuApresentacao())

  function fecharApresentacao() {
    marcarApresentacaoVista()
    setMostrarApresentacao(false)
  }

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
    aplicarCombo,
    limparTudo,
  } = useFicha()

  const {
    historico,
    sessoesRecentes,
    ultimasCargas,
    evolucao,
    salvarSessao,
    removerSessao,
    totalSessoes,
  } = useHistorico()

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
            onClick={() => setMostrarApresentacao(true)}
            aria-label="Como usar"
            className="botao-fantasma"
          >
            <CircleHelp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="botao-fantasma border-acento/40 text-acento"
          >
            <FileDown className="h-3.5 w-3.5" /> PDF
          </button>
          <button
            type="button"
            onClick={() => exportarFicha(ficha, historico)}
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

      <div className="mb-5 flex gap-1 rounded-xl bg-base-800 p-1">
        {(
          [
            { id: 'ficha', nome: 'Ficha', Icone: ClipboardList, contador: totalExercicios },
            { id: 'progressao', nome: 'Progressão', Icone: LineChart, contador: totalSessoes },
          ] as const
        ).map(({ id, nome, Icone, contador }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAba(id)}
            aria-pressed={aba === id}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
              aba === id
                ? 'bg-base-600 text-zinc-100 shadow'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icone className="h-4 w-4" strokeWidth={2.25} />
            {nome}
            {contador > 0 && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  aba === id ? 'bg-acento/20 text-acento' : 'bg-white/5 text-zinc-500'
                }`}
              >
                {contador}
              </span>
            )}
          </button>
        ))}
      </div>

      {aba === 'progressao' ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <RegistrarSessao
              treinos={ficha.treinos}
              ultimasCargas={ultimasCargas}
              onSalvar={salvarSessao}
            />
          </div>
          <PainelEvolucao
            evolucao={evolucao}
            sessoes={sessoesRecentes}
            onRemoverSessao={removerSessao}
          />
        </div>
      ) : (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-6">
          <button
            type="button"
            onClick={() => setMostrarCombos(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-acento/40 bg-acento/5 py-2.5 text-sm font-semibold text-acento transition hover:bg-acento/10 active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
            Usar ficha pronta
          </button>

          <SeletorGrupo ativo={grupo} onChange={setGrupo} />
          <PainelExercicio
            grupo={grupo}
            nivel={nivel}
            onNivel={setNivel}
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
      )}

      <footer className="mt-10 text-center text-[11px] leading-relaxed text-zinc-600">
        Tudo fica salvo no seu navegador. Limpar os dados do site apaga a ficha —
        o botão <strong className="font-semibold text-zinc-500">PDF</strong> gera a
        ficha pra levar na academia e o de download guarda o backup em JSON.
      </footer>
    </div>

    <ModalCombos
      aberto={mostrarCombos}
      onFechar={() => setMostrarCombos(false)}
      exerciciosAtuais={totalExercicios}
      onAplicar={aplicarCombo}
    />

    <ModalBoasVindas
      aberto={mostrarApresentacao}
      onFechar={fecharApresentacao}
      totalExercicios={TOTAL_EXERCICIOS}
      totalGrupos={GRUPOS.length}
    />

    <FichaImprimivel ficha={ficha} />
    </>
  )
}
