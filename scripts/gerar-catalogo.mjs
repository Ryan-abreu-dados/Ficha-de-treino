/**
 * Baixa o catalogo de duas fontes e grava src/services/exercicios/catalogo.json:
 *
 *  - wger (https://wger.de/api/v2): 187 exercicios, curados nome a nome —
 *    traducao PT e instrucao de execucao escritas a mao (dicionario.mjs / instrucoes.mjs).
 *  - Free Exercise DB (github.com/yuhonas/free-exercise-db): 637 exercicios a mais,
 *    dominio publico (Unlicense), com foto real (nao desenho de linha) e nivel
 *    (beginner/intermediate/expert) ja rotulado pela propria fonte — por isso NAO
 *    tem uma lista `niveis.mjs` como a do wger, o nivel vem pronto do dado.
 *
 * Por que embutir em vez de chamar API em runtime:
 *  - so uma fracao dos exercicios de cada fonte tem imagem; refiltrar isso a cada
 *    page load e desperdicio
 *  - app abre offline e nao depende do uptime nem do CORS de ninguem
 *
 * A segunda fonte NAO recebe a mesma curadoria manual da primeira — 637 itens
 * traduzidos e com instrucao escrita a mao e trabalho de outra escala. O nome
 * so sai em PT quando bate com algo ja no dicionario (`TRADUCAO`); do contrario
 * fica em ingles, igual ao mock e ao wger ao vivo ja se comportam quando faltam.
 * `instrucoes` fica `null` quando nao ha verbete em PT — a UI ja trata isso.
 *
 * Rodar: npm run catalogo
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PADROES_EXCLUIR, EXCLUIR_POR_GRUPO, TRADUCAO, EQUIPAMENTO } from './dicionario.mjs'
import { INSTRUCAO } from './instrucoes.mjs'
import { INICIANTE, AVANCADO } from './niveis.mjs'

const WGER_BASE = 'https://wger.de/api/v2'
const WGER_EN = 2
const WGER_PT = 7

const WGER_MAPA = {
  peito: { categoria: 11 },
  costas: { categoria: 12 },
  pernas: { categoria: 9 },
  ombro: { categoria: 13 },
  biceps: { musculo: 1 },
  triceps: { musculo: 5 },
}

const SET_INICIANTE = new Set(INICIANTE)
const SET_AVANCADO = new Set(AVANCADO)

const naoTraduzidos = []
const semInstrucao = []

function excluir(nome, grupo) {
  if (PADROES_EXCLUIR.some((re) => re.test(nome))) return true
  return (EXCLUIR_POR_GRUPO[grupo] ?? []).includes(nome)
}

const semHtml = (s) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// ------------------------------------------------------------------ wger ---

async function buscarPaginaWger(filtro, offset) {
  const p = new URLSearchParams({ format: 'json', limit: '100', offset: String(offset) })
  if (filtro.categoria) p.set('category', String(filtro.categoria))
  if (filtro.musculo) p.set('muscles', String(filtro.musculo))
  const r = await fetch(`${WGER_BASE}/exerciseinfo/?${p}`)
  if (!r.ok) throw new Error(`wger respondeu ${r.status}`)
  return r.json()
}

async function buscarTudoWger(filtro) {
  const itens = []
  let offset = 0
  for (;;) {
    const d = await buscarPaginaWger(filtro, offset)
    itens.push(...d.results)
    if (!d.next) return itens
    offset += 100
  }
}

async function coletarWger() {
  const catalogo = []
  const relatorio = []

  for (const [grupo, filtro] of Object.entries(WGER_MAPA)) {
    const brutos = await buscarTudoWger(filtro)
    const vistos = new Set()
    let traduzidos = 0

    for (const b of brutos) {
      const img = b.images.find((i) => i.is_main) ?? b.images[0]
      if (!img) continue
      if (vistos.has(b.id)) continue
      vistos.add(b.id)

      const tEn = b.translations.find((t) => t.language === WGER_EN)
      const tPt = b.translations.find((t) => t.language === WGER_PT)
      const nomeEn = tEn?.name?.trim()
      if (!nomeEn) continue

      if (excluir(nomeEn, grupo)) continue

      const nomePt = TRADUCAO[nomeEn] ?? TRADUCAO[tPt?.name?.trim()] ?? null
      if (nomePt) traduzidos++
      else naoTraduzidos.push(`wger/${grupo}: ${nomeEn}`)

      const nomeFinal = nomePt || nomeEn

      const instrucoes = INSTRUCAO[nomeEn] ?? INSTRUCAO[nomeFinal] ?? null
      if (!instrucoes) semInstrucao.push(`wger/${grupo}: ${nomeEn}`)

      const id = `wger-${b.id}`
      const nivel = SET_INICIANTE.has(id)
        ? 'iniciante'
        : SET_AVANCADO.has(id)
          ? 'avancado'
          : 'intermediario'

      catalogo.push({
        id,
        nome: nomeFinal,
        nomeOriginal: nomeEn,
        grupo,
        nivel,
        imagem: img.image,
        equipamento: b.equipment.map((e) => EQUIPAMENTO[e.name] ?? e.name).join(' · ') || null,
        instrucoes,
      })
    }

    const doGrupo = catalogo.filter((e) => e.grupo === grupo).length
    relatorio.push(
      `  ${grupo.padEnd(9)} ${String(doGrupo).padStart(3)} exercicios | ${traduzidos} com nome em PT`,
    )
  }

  return { catalogo, relatorio }
}

// ----------------------------------------------------- Free Exercise DB ---

const FEDB_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const FEDB_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

const FEDB_MUSCULO_GRUPO = {
  chest: 'peito',
  lats: 'costas',
  'middle back': 'costas',
  'lower back': 'costas',
  quadriceps: 'pernas',
  hamstrings: 'pernas',
  calves: 'pernas',
  glutes: 'pernas',
  adductors: 'pernas',
  abductors: 'pernas',
  shoulders: 'ombro',
  traps: 'ombro',
  biceps: 'biceps',
  triceps: 'triceps',
  // abdominals, forearms e neck ficam de fora: nao sao um dos 6 grupos do app
}

const FEDB_NIVEL = {
  beginner: 'iniciante',
  intermediate: 'intermediario',
  expert: 'avancado',
}

async function coletarFreeExerciseDb() {
  const r = await fetch(FEDB_URL)
  if (!r.ok) throw new Error(`Free Exercise DB respondeu ${r.status}`)
  const brutos = await r.json()

  const catalogo = []
  const relatorio = { total: 0, semStretching: 0, semGrupo: 0, semImagem: 0 }

  for (const e of brutos) {
    if (e.category === 'stretching') {
      relatorio.semStretching++
      continue
    }
    if (!e.images || e.images.length === 0) {
      relatorio.semImagem++
      continue
    }

    const grupo = (e.primaryMuscles ?? []).map((m) => FEDB_MUSCULO_GRUPO[m]).find(Boolean)
    if (!grupo) {
      relatorio.semGrupo++
      continue
    }

    if (excluir(e.name, grupo)) continue

    const nomeFinal = TRADUCAO[e.name] ?? e.name
    const nivel = FEDB_NIVEL[e.level] ?? 'intermediario'
    // 'other' da fonte e generico demais pra virar rotulo em PT — melhor nao mostrar nada
    const equipamento =
      e.equipment && e.equipment !== 'other' ? (EQUIPAMENTO[e.equipment] ?? e.equipment) : null

    catalogo.push({
      id: `fedb-${e.id}`,
      nome: nomeFinal,
      nomeOriginal: e.name,
      grupo,
      nivel,
      imagem: `${FEDB_IMG_BASE}/${e.images[0]}`,
      equipamento,
      // a fonte tem instrucao em ingles bem escrita, mas nao ha verbete em PT
      // curado pra 637 itens de uma vez — fica null em vez de mostrar ingles
      // ou uma traducao automatica sem revisao
      instrucoes: null,
    })
    relatorio.total++
  }

  return { catalogo, relatorio }
}

// -------------------------------------------------------------- combina ---

const PARADAS = new Set(['the', 'with', 'and', 'for', 'on', 'a', 'an', 'to', 'of'])

function palavrasChave(nomeEn) {
  return new Set(
    nomeEn
      .toLowerCase()
      .replace(/[()\-,/]/g, ' ')
      .split(/\s+/)
      .filter((p) => p.length > 2 && !PARADAS.has(p)),
  )
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length
  const uniao = new Set([...a, ...b]).size
  return uniao === 0 ? 0 : inter / uniao
}

const { catalogo: catalogoWger, relatorio: relatorioWger } = await coletarWger()
const { catalogo: catalogoFedb, relatorio: relatorioFedb } = await coletarFreeExerciseDb()

/**
 * wger entra primeiro e nunca e descartado: e a versao com instrucao em PT
 * curada a mao. Um item do Free Exercise DB e descartado quando:
 *  a) o nome final (ja traduzido, quando ha traducao) colide exato com algo
 *     ja incluido no mesmo grupo, ou
 *  b) o nome ORIGINAL em ingles tem alta sobreposicao de palavras com o nome
 *     original de um exercicio do wger no mesmo grupo — e o caso de
 *     "Bent Over Barbell Row" (fedb) vs "Bent Over Rowing" (wger, virou
 *     "Remada curvada com barra"): nomes finais diferentes, mesmo exercicio.
 *     Sem essa checagem a lista dobraria de tamanho com repeticao disfarcada.
 */
const nomesFinais = new Set()
const porGrupoOriginal = {}
const catalogo = []
let duplicatasExatas = 0
let duplicatasParecidas = 0

for (const item of catalogoWger) {
  nomesFinais.add(`${item.grupo}|${item.nome}`)
  ;(porGrupoOriginal[item.grupo] ??= []).push(palavrasChave(item.nomeOriginal))
  catalogo.push(item)
}

for (const item of catalogoFedb) {
  const chave = `${item.grupo}|${item.nome}`
  if (nomesFinais.has(chave)) {
    duplicatasExatas++
    continue
  }

  const palavras = palavrasChave(item.nomeOriginal)
  const parecido = (porGrupoOriginal[item.grupo] ?? []).some((p) => jaccard(p, palavras) >= 0.5)
  if (parecido) {
    duplicatasParecidas++
    continue
  }

  nomesFinais.add(chave)
  ;(porGrupoOriginal[item.grupo] ??= []).push(palavras)
  catalogo.push(item)
}

catalogo.sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nome.localeCompare(b.nome, 'pt-BR'))

const destino = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'services',
  'exercicios',
  'catalogo.json',
)

await writeFile(destino, JSON.stringify(catalogo) + '\n', 'utf8')

console.log('wger:')
console.log(relatorioWger.join('\n'))
console.log(`\nFree Exercise DB: ${relatorioFedb.total} usaveis`)
console.log(
  `  descartados — alongamento: ${relatorioFedb.semStretching} | sem musculo nos 6 grupos: ${relatorioFedb.semGrupo} | sem imagem: ${relatorioFedb.semImagem}`,
)
console.log(
  `\nduplicatas descartadas do Free Exercise DB — nome identico: ${duplicatasExatas} | mesmo exercicio com nome parecido: ${duplicatasParecidas}`,
)
console.log(`\ntotal combinado: ${catalogo.length} exercicios com imagem`)

const porNivel = catalogo.reduce((a, e) => ({ ...a, [e.nivel]: (a[e.nivel] ?? 0) + 1 }), {})
console.log(
  `por nivel: iniciante ${porNivel.iniciante ?? 0} | intermediario ${porNivel.intermediario ?? 0} | avancado ${porNivel.avancado ?? 0}`,
)

const comInstrucao = catalogo.filter((e) => e.instrucoes).length
console.log(`com instrucao em PT: ${comInstrucao} de ${catalogo.length}`)

if (semInstrucao.length) {
  console.log(`\nsem texto de execucao (so wger — fedb ja sabidamente sem): ${semInstrucao.length}`)
}
if (naoTraduzidos.length) {
  console.log(`\nsem traducao PT (so wger — fedb ja sabidamente sem): ${naoTraduzidos.length}`)
}
