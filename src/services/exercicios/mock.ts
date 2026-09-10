import { GRUPOS, type Exercicio, type Grupo, type GrupoId } from '@/types'
import type { FonteExercicios } from './types'

const CATALOGO: Exercicio[] = [
  {
    id: 'mock-supino-reto',
    nome: 'Supino reto com barra',
    grupo: 'peito',
    imagem: 'https://wger.de/media/exercise-images/192/Bench-press-1.png',
    equipamento: 'Barra',
    instrucoes:
      'Deitado no banco, escápulas retraídas. Desça a barra até a linha do mamilo e empurre sem travar o cotovelo.',
    fonte: 'mock',
  },
  {
    id: 'mock-supino-halteres',
    nome: 'Supino com halteres',
    grupo: 'peito',
    imagem: 'https://wger.de/media/exercise-images/97/Dumbbell-bench-press-1.png',
    equipamento: 'Halteres',
    instrucoes: 'Amplitude maior que a barra. Não deixe os halteres se tocarem no topo.',
    fonte: 'mock',
  },
  {
    id: 'mock-crucifixo-maquina',
    nome: 'Crucifixo na máquina (peck deck)',
    grupo: 'peito',
    imagem: 'https://wger.de/media/exercise-images/98/Butterfly-machine-2.png',
    equipamento: 'Máquina',
    instrucoes: 'Cotovelo levemente flexionado e fixo. O movimento é do ombro, não do braço.',
    fonte: 'mock',
  },
  {
    id: 'mock-remada-curvada',
    nome: 'Remada curvada com barra',
    grupo: 'costas',
    imagem: 'https://wger.de/media/exercise-images/109/Barbell-rear-delt-row-1.png',
    equipamento: 'Barra',
    instrucoes: 'Tronco a ~45°, coluna neutra. Puxe em direção ao umbigo.',
    fonte: 'mock',
  },
  {
    id: 'mock-puxada-frente',
    nome: 'Puxada frontal pegada fechada',
    grupo: 'costas',
    imagem:
      'https://wger.de/media/exercise-images/158/0d51a0f2-622f-434b-beb8-1a003c54712a.png',
    equipamento: 'Polia alta',
    instrucoes: 'Puxe com o cotovelo, não com a mão. Peito para cima no final.',
    fonte: 'mock',
  },
  {
    id: 'mock-levantamento-terra',
    nome: 'Levantamento terra',
    grupo: 'costas',
    imagem:
      'https://wger.de/media/exercise-images/184/1709c405-620a-4d07-9658-fade2b66a2df.jpeg',
    equipamento: 'Barra',
    instrucoes: 'Barra colada na canela. Empurre o chão, não puxe a barra.',
    fonte: 'mock',
  },
  {
    id: 'mock-agachamento-goblet',
    nome: 'Agachamento goblet',
    grupo: 'pernas',
    imagem:
      'https://wger.de/media/exercise-images/203/1c052351-2af0-4227-aeb0-244008e4b0a8.jpeg',
    equipamento: 'Halter',
    instrucoes: 'Halter junto ao peito, desça entre os calcanhares mantendo o tronco ereto.',
    fonte: 'mock',
  },
  {
    id: 'mock-afundo-caminhando',
    nome: 'Afundo caminhando com halteres',
    grupo: 'pernas',
    imagem: 'https://wger.de/media/exercise-images/113/Walking-lunges-1.png',
    equipamento: 'Halteres',
    instrucoes: 'Passada longa para glúteo, curta para quadríceps. Joelho alinhado ao pé.',
    fonte: 'mock',
  },
  {
    id: 'mock-desenvolvimento',
    nome: 'Desenvolvimento de ombro',
    grupo: 'ombro',
    imagem:
      'https://wger.de/media/exercise-images/79/da58dfbf-748a-461b-891e-3d6bc9cc4be2.png',
    equipamento: 'Halteres',
    instrucoes: 'Não hiperestenda a lombar. Suba até quase travar o cotovelo.',
    fonte: 'mock',
  },
  {
    id: 'mock-rosca-direta',
    nome: 'Rosca direta com barra',
    grupo: 'biceps',
    imagem: 'https://wger.de/media/exercise-images/74/Bicep-curls-1.png',
    equipamento: 'Barra',
    instrucoes: 'Cotovelo colado ao tronco. Sem balanço de quadril.',
    fonte: 'mock',
  },
  {
    id: 'mock-rosca-alternada',
    nome: 'Rosca alternada com halteres',
    grupo: 'biceps',
    imagem: 'https://wger.de/media/exercise-images/81/Biceps-curl-1.png',
    equipamento: 'Halteres',
    instrucoes: 'Supine o punho durante a subida para recrutar mais o bíceps.',
    fonte: 'mock',
  },
  {
    id: 'mock-triceps-testa',
    nome: 'Tríceps testa com barra',
    grupo: 'triceps',
    imagem:
      'https://wger.de/media/exercise-images/50/695ced5c-9961-4076-add2-cb250d01089e.png',
    equipamento: 'Barra W',
    instrucoes: 'Cotovelo fixo apontando para o teto. Só o antebraço se move.',
    fonte: 'mock',
  },
  {
    id: 'mock-triceps-banco',
    nome: 'Mergulho no banco',
    grupo: 'triceps',
    imagem: 'https://wger.de/media/exercise-images/83/Bench-dips-1.png',
    equipamento: 'Peso corporal',
    instrucoes: 'Desça até o cotovelo formar 90°. Ombro pode reclamar se descer demais.',
    fonte: 'mock',
  },
]

/** Latencia artificial pra que os estados de loading da UI sejam testaveis. */
const atraso = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const fonteMock: FonteExercicios = {
  id: 'mock',
  rotulo: 'Catálogo local (mock)',

  async listarGrupos(): Promise<Grupo[]> {
    await atraso(120)
    return GRUPOS
  },

  async listarExercicios(grupo: GrupoId): Promise<Exercicio[]> {
    await atraso(280)
    return CATALOGO.filter((e) => e.grupo === grupo)
  },
}
