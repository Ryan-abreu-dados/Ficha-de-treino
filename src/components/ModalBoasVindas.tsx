import { useEffect, useRef } from 'react'
import { Dumbbell, FileDown, LineChart, ListPlus, Search, Sparkles, X } from 'lucide-react'

interface Props {
  aberto: boolean
  onFechar: () => void
  totalExercicios: number
  totalGrupos: number
}

const PASSOS = [
  {
    icone: Sparkles,
    titulo: 'Comece por uma ficha pronta',
    texto:
      'Tem opções por experiência (iniciante, intermediário, avançado) e por objetivo (força, ganhar massa, emagrecimento, definição, foco em costas) que já preenchem os treinos inteiros. Ou monte do zero, se preferir.',
  },
  {
    icone: Search,
    titulo: 'Escolha grupo, nível e exercício',
    texto:
      'Filtre por Peito, Costas, Pernas, Ombro, Bíceps ou Tríceps, e por nível técnico. Não achou o que procurava? "Criar exercício manual" adiciona pelo nome, mesmo sem foto.',
  },
  {
    icone: ListPlus,
    titulo: 'Ajuste a ficha quando quiser',
    texto:
      'O botão + cria mais treinos e tocar na aba aberta renomeia. Dá para editar carga, reordenar e excluir a qualquer momento.',
  },
  {
    icone: LineChart,
    titulo: 'Registre a carga na aba Progressão',
    texto:
      'Escolha o treino do dia e anote o peso de cada série. Os exercícios já vêm da sua ficha e a carga da última vez vem preenchida — normalmente é só conferir e salvar.',
  },
  {
    icone: FileDown,
    titulo: 'Leve para a academia',
    texto:
      'O botão PDF gera a ficha com as imagens e uma coluna em branco para anotar no papel.',
  },
]

export function ModalBoasVindas({ aberto, onFechar, totalExercicios, totalGrupos }: Props) {
  const fecharRef = useRef<HTMLButtonElement>(null)

  // Esc fecha, e o scroll do fundo trava enquanto o modal esta aberto —
  // sem isso o dedo arrasta a pagina de tras no celular.
  useEffect(() => {
    if (!aberto) return

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', aoTeclar)

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fecharRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div
      className="sem-impressao fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onFechar}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-boas-vindas"
        // o clique no cartao nao pode fechar junto com o clique no fundo
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-base-800 p-5 pb-7 shadow-2xl sm:rounded-3xl sm:pb-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-acento/15 p-2 text-acento">
              <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 id="titulo-boas-vindas" className="text-lg font-extrabold leading-none">
                Ficha do Ryan
              </h2>
              <p className="mt-1 text-xs text-zinc-500">Monte e acompanhe seu treino</p>
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

        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
          Aqui você monta sua ficha de musculação escolhendo entre{' '}
          <strong className="font-semibold text-acento">{totalExercicios} exercícios</strong>{' '}
          — todos com imagem de execução — separados em {totalGrupos} grupos musculares, e
          acompanha a evolução da sua carga ao longo dos meses.
        </p>

        <ol className="mt-4 space-y-3">
          {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li key={titulo} className="flex gap-3">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-700 text-acento">
                  <Icone className="h-4 w-4" strokeWidth={2.25} />
                </div>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-acento text-[10px] font-bold text-base-900">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-sm font-semibold leading-tight">{titulo}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-xl border border-white/5 bg-base-700/50 p-3">
          <p className="text-xs leading-relaxed text-zinc-400">
            <strong className="font-semibold text-zinc-200">
              Ficha e histórico ficam só neste aparelho.
            </strong>{' '}
            Nada é enviado para lugar nenhum — o que você monta não aparece para mais
            ninguém, mas também não segue para outro celular. Limpar os dados do navegador
            apaga tudo, então use o botão de download para guardar um backup.
          </p>
        </div>

        <button type="button" onClick={onFechar} className="botao-primario mt-4">
          Montar meu treino
        </button>
      </div>
    </div>
  )
}
