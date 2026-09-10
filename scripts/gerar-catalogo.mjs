/**
 * Baixa o catalogo do wger uma vez e grava src/services/exercicios/catalogo.json.
 *
 * Por que embutir em vez de chamar a API em runtime:
 *  - so ~30% dos exercicios do wger tem imagem; refiltrar isso a cada page load e desperdicio
 *  - a traducao PT deles cobre 7% dos nomes, entao a traduzida sai daqui, nao de la
 *  - app abre offline e nao depende do uptime nem do CORS do wger
 *
 * Rodar: npm run catalogo
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const BASE = 'https://wger.de/api/v2'
const EN = 2
const PT = 7

const MAPA = {
  peito: { categoria: 11 },
  costas: { categoria: 12 },
  pernas: { categoria: 9 },
  ombro: { categoria: 13 },
  biceps: { musculo: 1 },
  triceps: { musculo: 5 },
}

import { PADROES_EXCLUIR, EXCLUIR_POR_GRUPO, TRADUCAO, EQUIPAMENTO } from './dicionario.mjs'
import { INSTRUCAO } from './instrucoes.mjs'
import { INICIANTE, AVANCADO } from './niveis.mjs'

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

async function buscarPagina(filtro, offset) {
  const p = new URLSearchParams({ format: 'json', limit: '100', offset: String(offset) })
  if (filtro.categoria) p.set('category', String(filtro.categoria))
  if (filtro.musculo) p.set('muscles', String(filtro.musculo))
  const r = await fetch(`${BASE}/exerciseinfo/?${p}`)
  if (!r.ok) throw new Error(`wger respondeu ${r.status}`)
  return r.json()
}

async function buscarTudo(filtro) {
  const itens = []
  let offset = 0
  for (;;) {
    const d = await buscarPagina(filtro, offset)
    itens.push(...d.results)
    if (!d.next) return itens
    offset += 100
  }
}

const catalogo = []
const relatorio = []

for (const [grupo, filtro] of Object.entries(MAPA)) {
  const brutos = await buscarTudo(filtro)
  const vistos = new Set()
  // dois ids diferentes do wger podem virar o mesmo nome em PT
  // (ex.: "Machine Lateral Raise" e "Machine Side Lateral Raises");
  // duas linhas identicas no select nao ajudam ninguem
  const nomesUsados = new Set()
  let traduzidos = 0

  for (const b of brutos) {
    const img = b.images.find((i) => i.is_main) ?? b.images[0]
    if (!img) continue
    if (vistos.has(b.id)) continue
    vistos.add(b.id)

    const tEn = b.translations.find((t) => t.language === EN)
    const tPt = b.translations.find((t) => t.language === PT)
    const nomeEn = tEn?.name?.trim()
    if (!nomeEn) continue

    if (excluir(nomeEn, grupo)) continue

    const nomePt = TRADUCAO[nomeEn] ?? TRADUCAO[tPt?.name?.trim()] ?? null
    if (nomePt) traduzidos++
    else naoTraduzidos.push(`${grupo}: ${nomeEn}`)

    const nomeFinal = nomePt || nomeEn
    if (nomesUsados.has(nomeFinal)) continue
    nomesUsados.add(nomeFinal)

    // a descricao que vem do wger e em ingles e de qualidade irregular:
    // ou tem verbete escrito a mao aqui, ou o exercicio vai sem texto
    const instrucoes = INSTRUCAO[nomeEn] ?? INSTRUCAO[nomeFinal] ?? null
    if (!instrucoes) semInstrucao.push(`${grupo}: ${nomeEn}`)

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
    `${grupo.padEnd(9)} ${String(doGrupo).padStart(3)} exercicios | ${traduzidos} com nome em PT`,
  )
}

catalogo.sort(
  (a, b) => a.grupo.localeCompare(b.grupo) || a.nome.localeCompare(b.nome, 'pt-BR'),
)

const destino = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'services',
  'exercicios',
  'catalogo.json',
)

await writeFile(destino, JSON.stringify(catalogo) + '\n', 'utf8')

console.log(relatorio.join('\n'))
console.log(`\ntotal: ${catalogo.length} exercicios com imagem`)
