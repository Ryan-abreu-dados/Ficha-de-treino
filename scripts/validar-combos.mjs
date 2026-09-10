/**
 * Confere que todo item dos combos existe no catalogo, no grupo declarado.
 *
 * Sem isso, um id errado nao da erro nenhum: o exercicio simplesmente nao entra
 * na ficha e o combo aplica menor do que deveria. Roda junto do build.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const catalogo = JSON.parse(
  await readFile(path.join(raiz, 'src/services/exercicios/catalogo.json'), 'utf8'),
)
const fonte = await readFile(path.join(raiz, 'src/data/combos.ts'), 'utf8')

const chaves = new Set(catalogo.map((e) => `${e.id}|${e.grupo}`))
const porId = new Map()
for (const e of catalogo) porId.set(e.id, e)

const itens = [...fonte.matchAll(/s\('([^']+)',\s*'([^']+)'/g)]
const erros = []

for (const [, id, grupo] of itens) {
  if (chaves.has(`${id}|${grupo}`)) continue
  const achado = porId.get(id)
  erros.push(
    achado
      ? `${id} existe, mas no grupo "${achado.grupo}" (combo declara "${grupo}") — ${achado.nome}`
      : `${id} nao existe no catalogo (grupo declarado: ${grupo})`,
  )
}

if (erros.length) {
  console.error(`\n${erros.length} item(ns) invalido(s) nos combos:`)
  erros.forEach((e) => console.error('  ' + e))
  process.exit(1)
}

console.log(`combos: ${itens.length} itens conferidos, todos existem no catalogo`)
