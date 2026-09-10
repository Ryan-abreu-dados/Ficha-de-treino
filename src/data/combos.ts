import type { GrupoId } from '@/types'

/**
 * Fichas prontas. O que muda entre elas nao e o "cardapio de exercicios" e sim
 * a divisao e o volume — que e o que de fato separa quem comeca de quem treina
 * ha anos:
 *
 *  - iniciante:    2 treinos full body alternados, 2 a 3x por semana. O corpo
 *                  inteiro em cada sessao, com maquina e trajetoria guiada.
 *  - intermediario: 3 treinos, cada grupo uma vez por semana, peso livre entrando.
 *  - avancado:     4 treinos, mais volume por grupo e os basicos pesados no inicio.
 *
 * `grupo` fica junto do id porque o catalogo repete o mesmo id em dois grupos
 * (Chin Up esta em costas e biceps, Dips em peito e triceps) — sem isso, o
 * exercicio poderia entrar na ficha rotulado com o grupo errado.
 */

export type NivelCombo = 'iniciante' | 'intermediario' | 'avancado'

export interface ItemCombo {
  id: string
  grupo: GrupoId
  series: number
  reps: number
}

export interface TreinoCombo {
  nome: string
  itens: ItemCombo[]
}

export interface Combo {
  nivel: NivelCombo
  titulo: string
  publico: string
  resumo: string
  frequencia: string
  treinos: TreinoCombo[]
}

const s = (id: string, grupo: GrupoId, series: number, reps: number): ItemCombo => ({
  id,
  grupo,
  series,
  reps,
})

export const COMBOS: Combo[] = [
  {
    nivel: 'iniciante',
    titulo: 'Iniciante',
    publico: 'Primeiros meses de academia',
    resumo:
      'Dois treinos de corpo inteiro que se alternam, com máquina e movimento guiado. O foco aqui é aprender a execução e criar frequência — não pegar peso.',
    frequencia: '2 a 3x por semana, alternando A e B',
    treinos: [
      {
        nome: 'Treino A',
        itens: [
          s('wger-371', 'pernas', 3, 12), // leg press
          s('wger-366', 'pernas', 3, 12), // cadeira flexora
          s('wger-129', 'peito', 3, 12), // supino na máquina
          s('wger-158', 'costas', 3, 12), // puxada frontal pegada fechada
          s('wger-543', 'ombro', 3, 12), // desenvolvimento na máquina
          s('wger-91', 'biceps', 3, 12), // rosca direta com barra
          s('wger-1185', 'triceps', 3, 12), // tríceps pulley
        ],
      },
      {
        nome: 'Treino B',
        itens: [
          s('wger-1747', 'pernas', 3, 12), // agachamento no Smith
          s('wger-369', 'pernas', 3, 12), // cadeira extensora
          s('wger-1243', 'pernas', 3, 15), // panturrilha
          s('wger-75', 'peito', 3, 12), // supino reto com halteres
          s('wger-1725', 'costas', 3, 12), // remada sentada na máquina
          s('wger-348', 'ombro', 3, 12), // elevação lateral
          s('wger-1900', 'triceps', 3, 12), // tríceps corda
        ],
      },
    ],
  },

  {
    nivel: 'intermediario',
    titulo: 'Intermediário',
    publico: 'A partir de uns 6 meses treinando',
    resumo:
      'Divisão clássica em três: peito e tríceps, costas e bíceps, pernas e ombro. Cada grupo recebe uma sessão dedicada por semana e o peso livre passa a ocupar o começo do treino.',
    frequencia: '3 a 4x por semana',
    treinos: [
      {
        nome: 'Treino A — Peito e Tríceps',
        itens: [
          s('wger-73', 'peito', 4, 10), // supino reto com barra
          s('wger-537', 'peito', 3, 12), // supino inclinado com halteres
          s('wger-135', 'peito', 3, 12), // crucifixo na máquina
          s('wger-246', 'triceps', 3, 12), // tríceps testa com barra W
          s('wger-1900', 'triceps', 3, 12), // tríceps corda
          s('wger-197', 'triceps', 3, 12), // mergulho entre bancos
        ],
      },
      {
        nome: 'Treino B — Costas e Bíceps',
        itens: [
          s('wger-158', 'costas', 4, 10), // puxada frontal pegada fechada
          s('wger-83', 'costas', 4, 10), // remada curvada com barra
          s('wger-1117', 'costas', 3, 12), // remada sentada na polia
          s('wger-1137', 'costas', 3, 12), // pullover na polia alta
          s('wger-91', 'biceps', 3, 12), // rosca direta com barra
          s('wger-272', 'biceps', 3, 12), // rosca martelo
        ],
      },
      {
        nome: 'Treino C — Pernas e Ombro',
        itens: [
          s('wger-1747', 'pernas', 4, 10), // agachamento no Smith
          s('wger-371', 'pernas', 4, 12), // leg press
          s('wger-365', 'pernas', 3, 12), // mesa flexora
          s('wger-369', 'pernas', 3, 12), // cadeira extensora
          s('wger-1243', 'pernas', 4, 15), // panturrilha
          s('wger-567', 'ombro', 4, 10), // desenvolvimento com halteres
          s('wger-348', 'ombro', 3, 12), // elevação lateral
        ],
      },
    ],
  },

  {
    nivel: 'avancado',
    titulo: 'Avançado',
    publico: 'Um ano ou mais de treino consistente',
    resumo:
      'Quatro treinos, com ombro e braços ganhando sessão própria. Os básicos pesados abrem cada treino, enquanto ainda sobra energia, e o volume por grupo sobe.',
    frequencia: '4 a 5x por semana',
    treinos: [
      {
        nome: 'Treino A — Peito e Tríceps',
        itens: [
          s('wger-73', 'peito', 4, 8), // supino reto com barra
          s('wger-538', 'peito', 4, 10), // supino inclinado com barra
          s('wger-238', 'peito', 3, 12), // crucifixo com halteres
          s('wger-323', 'peito', 3, 15), // cross-over na polia
          s('wger-194', 'peito', 3, 10), // mergulho nas paralelas
          s('wger-50', 'triceps', 4, 10), // tríceps testa com barra
          s('wger-1900', 'triceps', 3, 12), // tríceps corda
        ],
      },
      {
        nome: 'Treino B — Costas e Bíceps',
        itens: [
          s('wger-475', 'costas', 4, 8), // barra fixa
          s('wger-83', 'costas', 4, 8), // remada curvada com barra
          s('wger-513', 'costas', 4, 10), // remada cavalinho
          s('wger-1127', 'costas', 3, 12), // puxada supinada pegada fechada
          s('wger-1726', 'costas', 3, 15), // pulldown com braço estendido
          s('wger-94', 'biceps', 4, 10), // rosca direta com barra W
          s('wger-1567', 'biceps', 3, 12), // rosca martelo alternada
        ],
      },
      {
        nome: 'Treino C — Pernas',
        itens: [
          s('wger-1801', 'pernas', 5, 8), // agachamento livre com barra
          s('wger-371', 'pernas', 4, 12), // leg press
          s('wger-507', 'pernas', 4, 10), // stiff
          s('wger-365', 'pernas', 4, 12), // mesa flexora
          s('wger-369', 'pernas', 4, 12), // cadeira extensora
          s('wger-206', 'pernas', 3, 12), // afundo caminhando com halteres
          s('wger-1243', 'pernas', 5, 15), // panturrilha
        ],
      },
      {
        nome: 'Treino D — Ombro e Braços',
        itens: [
          s('wger-1893', 'ombro', 4, 8), // desenvolvimento acima da cabeça
          s('wger-348', 'ombro', 4, 12), // elevação lateral
          s('wger-822', 'ombro', 3, 15), // crucifixo inverso na polia
          s('wger-571', 'ombro', 4, 12), // encolhimento com barra
          s('wger-92', 'biceps', 3, 12), // rosca alternada com halteres
          s('wger-1109', 'biceps', 3, 12), // rosca concentrada na polia
          s('wger-659', 'triceps', 3, 12), // tríceps na polia
          s('wger-1336', 'triceps', 3, 12), // tríceps francês com halter
        ],
      },
    ],
  },
]
