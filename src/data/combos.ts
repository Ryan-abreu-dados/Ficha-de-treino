import type { GrupoId } from '@/types'

/**
 * Fichas prontas, em duas categorias:
 *
 *  - 'experiencia': iniciante / intermediario / avancado. O que muda entre elas
 *    nao e o cardapio de exercicios e sim a divisao e o volume — que e o que de
 *    fato separa quem comeca de quem treina ha anos.
 *  - 'foco': objetivo especifico (forca, massa, emagrecimento, definicao, ou
 *    priorizar um grupo). Pressupoe que a pessoa ja tem alguma base — nao sao
 *    escalonadas por experiencia como as de cima.
 *
 * `grupo` fica junto do id em ItemCombo porque o catalogo repete o mesmo id em
 * dois grupos (Chin Up esta em costas e biceps, Dips em peito e triceps) — sem
 * isso, o exercicio poderia entrar na ficha rotulado com o grupo errado.
 *
 * Duas coisas que este arquivo NAO faz, de proposito:
 *  - nao tem campo de tempo de descanso — o schema da ficha nao guarda isso em
 *    lugar nenhum ainda, entao a orientacao de descanso fica so no `resumo`;
 *  - "emagrecimento" e "definicao" avisam no `resumo` que isso vem principalmente
 *    da alimentacao (deficit calorico / percentual de gordura), nao do tipo de
 *    exercicio. Prometer que um treino "define" ou "emagrece" sozinho seria
 *    vender o que a ficha nao entrega.
 */

export type CategoriaCombo = 'experiencia' | 'foco'

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
  /** identidade estavel, usada como key e para controlar qual card esta expandido */
  id: string
  categoria: CategoriaCombo
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
  // ------------------------------------------------------------ experiencia ---
  {
    id: 'iniciante',
    categoria: 'experiencia',
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
    id: 'intermediario',
    categoria: 'experiencia',
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
    id: 'avancado',
    categoria: 'experiencia',
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

  // ------------------------------------------------------------------- foco ---
  {
    id: 'foco-forca',
    categoria: 'foco',
    titulo: 'Força',
    publico: 'Já executa os básicos com boa técnica',
    resumo:
      'Poucos exercícios por treino, todos compostos pesados, de 3 a 6 repetições. Descanse de verdade entre as séries dos básicos — 2 a 3 minutos, não 40 segundos. O objetivo é a carga subir, não o cansaço.',
    frequencia: '3x por semana, descansando ao menos um dia entre sessões',
    treinos: [
      {
        nome: 'Treino A — Empurrar',
        itens: [
          s('wger-73', 'peito', 5, 5), // supino reto com barra
          s('wger-538', 'peito', 4, 6), // supino inclinado com barra
          s('wger-566', 'ombro', 4, 6), // desenvolvimento com barra
          s('wger-194', 'peito', 3, 8), // mergulho nas paralelas
        ],
      },
      {
        nome: 'Treino B — Puxar',
        itens: [
          s('wger-184', 'costas', 4, 5), // levantamento terra
          s('wger-475', 'costas', 4, 6), // barra fixa
          s('wger-83', 'costas', 4, 6), // remada curvada com barra
          s('wger-158', 'costas', 3, 8), // puxada frontal pegada fechada
        ],
      },
      {
        nome: 'Treino C — Pernas',
        itens: [
          s('wger-1801', 'pernas', 5, 5), // agachamento livre com barra
          s('wger-507', 'pernas', 4, 6), // stiff
          s('wger-371', 'pernas', 3, 8), // leg press
          s('wger-1243', 'pernas', 4, 10), // panturrilha
        ],
      },
    ],
  },

  {
    id: 'foco-massa',
    categoria: 'foco',
    titulo: 'Ganhar massa',
    publico: 'Já tem base, quer aumentar volume muscular',
    resumo:
      'Push/pull/legs com mais exercícios por sessão que o plano intermediário — hipertrofia responde a volume total somado ao longo da semana, então o que carrega esse plano é a soma das séries, não um exercício milagroso. Reps entre 8 e 15.',
    frequencia: '4 a 5x por semana (dá pra repetir o ciclo duas vezes)',
    treinos: [
      {
        nome: 'Treino A — Push (peito, ombro, tríceps)',
        itens: [
          s('wger-73', 'peito', 4, 10), // supino reto com barra
          s('wger-537', 'peito', 3, 12), // supino inclinado com halteres
          s('wger-135', 'peito', 3, 15), // crucifixo na máquina
          s('wger-567', 'ombro', 3, 10), // desenvolvimento com halteres
          s('wger-348', 'ombro', 4, 15), // elevação lateral
          s('wger-1900', 'triceps', 3, 12), // tríceps corda
          s('wger-50', 'triceps', 3, 12), // tríceps testa com barra
        ],
      },
      {
        nome: 'Treino B — Pull (costas, bíceps)',
        itens: [
          s('wger-184', 'costas', 3, 8), // levantamento terra
          s('wger-158', 'costas', 4, 10), // puxada frontal pegada fechada
          s('wger-83', 'costas', 4, 10), // remada curvada com barra
          s('wger-1117', 'costas', 3, 12), // remada sentada na polia
          s('wger-91', 'biceps', 3, 10), // rosca direta com barra
          s('wger-272', 'biceps', 3, 12), // rosca martelo
        ],
      },
      {
        nome: 'Treino C — Legs (pernas)',
        itens: [
          s('wger-1801', 'pernas', 4, 10), // agachamento livre com barra
          s('wger-371', 'pernas', 4, 12), // leg press
          s('wger-369', 'pernas', 3, 15), // cadeira extensora
          s('wger-365', 'pernas', 3, 15), // mesa flexora
          s('wger-206', 'pernas', 3, 12), // afundo caminhando com halteres
          s('wger-1243', 'pernas', 4, 15), // panturrilha
        ],
      },
    ],
  },

  {
    id: 'foco-emagrecimento',
    categoria: 'foco',
    titulo: 'Emagrecimento',
    publico: 'Quer perder gordura sem perder força',
    resumo:
      'Aviso direto: quem emagrece é o déficit calórico — a alimentação, não o treino. O que esta ficha faz é preservar massa muscular durante a dieta e gastar um pouco mais de caloria com descanso curto entre séries (30 a 45 segundos). Sem controlar a comida, o treino sozinho não entrega o resultado.',
    frequencia: '3x por semana, corpo inteiro, descanso curto',
    treinos: [
      {
        nome: 'Treino A',
        itens: [
          s('wger-1747', 'pernas', 3, 15), // agachamento no Smith
          s('wger-129', 'peito', 3, 15), // supino na máquina
          s('wger-158', 'costas', 3, 15), // puxada frontal pegada fechada
          s('wger-348', 'ombro', 3, 15), // elevação lateral
          s('wger-1185', 'triceps', 3, 15), // tríceps pulley
          s('wger-91', 'biceps', 3, 15), // rosca direta com barra
          s('wger-1243', 'pernas', 3, 20), // panturrilha
        ],
      },
      {
        nome: 'Treino B',
        itens: [
          s('wger-371', 'pernas', 3, 15), // leg press
          s('wger-1725', 'costas', 3, 15), // remada sentada na máquina
          s('wger-135', 'peito', 3, 15), // crucifixo na máquina
          s('wger-543', 'ombro', 3, 15), // desenvolvimento na máquina
          s('wger-369', 'pernas', 3, 15), // cadeira extensora
          s('wger-366', 'pernas', 3, 15), // cadeira flexora
          s('wger-1100', 'pernas', 3, 15), // wall ball
        ],
      },
    ],
  },

  {
    id: 'foco-definicao',
    categoria: 'foco',
    titulo: 'Definição',
    publico: 'Já treina, quer contornos mais visíveis',
    resumo:
      'Definição visível depende sobretudo do percentual de gordura — ou seja, de dieta — não de um tipo especial de exercício que "esculpe" o músculo. O treino aqui é hipertrofia com reps um pouco mais altas e descanso mais curto (45 a 60 segundos); o "definido" vem de somar isso a um déficit calórico controlado, não do treino isolado.',
    frequencia: '4x por semana, alternando superior e inferior',
    treinos: [
      {
        nome: 'Treino A — Superior',
        itens: [
          s('wger-537', 'peito', 3, 12), // supino inclinado com halteres
          s('wger-158', 'costas', 3, 12), // puxada frontal pegada fechada
          s('wger-567', 'ombro', 3, 12), // desenvolvimento com halteres
          s('wger-1117', 'costas', 3, 12), // remada sentada na polia
          s('wger-348', 'ombro', 3, 15), // elevação lateral
          s('wger-272', 'biceps', 3, 12), // rosca martelo
          s('wger-1900', 'triceps', 3, 12), // tríceps corda
        ],
      },
      {
        nome: 'Treino B — Inferior',
        itens: [
          s('wger-1747', 'pernas', 3, 12), // agachamento no Smith
          s('wger-507', 'pernas', 3, 12), // stiff
          s('wger-371', 'pernas', 3, 15), // leg press
          s('wger-369', 'pernas', 3, 15), // cadeira extensora
          s('wger-365', 'pernas', 3, 15), // mesa flexora
          s('wger-1642', 'pernas', 3, 15), // elevação pélvica com halter
          s('wger-1243', 'pernas', 3, 15), // panturrilha
        ],
      },
    ],
  },

  {
    id: 'foco-costas',
    categoria: 'foco',
    titulo: 'Foco em costas',
    publico: 'Quer priorizar as costas sem abandonar o resto',
    resumo:
      'Dois treinos de costas por semana — o dobro do volume normal — intercalados com um treino leve pro resto do corpo, só pra manter. É a lógica padrão pra tirar um grupo do atraso: prioriza sem abandonar o que já tem.',
    frequencia: '3x por semana — dois de costas, um de manutenção',
    treinos: [
      {
        nome: 'Treino A — Costas (espessura)',
        itens: [
          s('wger-184', 'costas', 4, 6), // levantamento terra
          s('wger-83', 'costas', 4, 8), // remada curvada com barra
          s('wger-1117', 'costas', 3, 12), // remada sentada na polia
          s('wger-1637', 'costas', 3, 12), // remada unilateral com halter
          s('wger-571', 'ombro', 3, 12), // encolhimento com barra
        ],
      },
      {
        nome: 'Treino B — Costas (largura)',
        itens: [
          s('wger-475', 'costas', 4, 8), // barra fixa
          s('wger-158', 'costas', 4, 10), // puxada frontal pegada fechada
          s('wger-1127', 'costas', 3, 12), // puxada supinada pegada fechada
          s('wger-1137', 'costas', 3, 15), // pullover na polia alta
          s('wger-1732', 'costas', 3, 15), // face pull com elástico
        ],
      },
      {
        nome: 'Treino C — Resto do corpo (manutenção)',
        itens: [
          s('wger-73', 'peito', 3, 10), // supino reto com barra
          s('wger-567', 'ombro', 3, 10), // desenvolvimento com halteres
          s('wger-1747', 'pernas', 3, 10), // agachamento no Smith
          s('wger-371', 'pernas', 3, 12), // leg press
          s('wger-91', 'biceps', 2, 12), // rosca direta com barra
          s('wger-1900', 'triceps', 2, 12), // tríceps corda
        ],
      },
    ],
  },
]
