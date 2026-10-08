// Valida src/data/games.json antes de construir: campos, ids únicos y que existan
// los archivos locales referenciados (cover, screenshots, downloadUrl, playUrl).
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let games
try {
  games = JSON.parse(readFileSync(join(root, 'src/data/games.json'), 'utf8'))
} catch (e) {
  console.error('✖ src/data/games.json no es un JSON válido:', e.message)
  process.exit(1)
}

const errors = []
const ids = new Set()
const isRemote = (p) => /^(https?:)?\/\//.test(p)
const checkFile = (g, field, p) => {
  if (p && !isRemote(p) && !existsSync(join(root, 'public', p.replace(/^\.?\//, '')))) {
    errors.push(`"${g.id}": ${field} apunta a "${p}" pero no existe en public/`)
  }
}

if (!Array.isArray(games)) errors.push('games.json debe ser una lista []')
else
  for (const g of games) {
    if (!g.id || !g.title) errors.push(`Juego sin id o title: ${JSON.stringify(g).slice(0, 80)}`)
    if (ids.has(g.id)) errors.push(`id duplicado: "${g.id}"`)
    ids.add(g.id)
    checkFile(g, 'cover', g.cover)
    checkFile(g, 'downloadUrl', g.downloadUrl)
    checkFile(g, 'playUrl', g.playUrl)
    ;(g.screenshots || []).forEach((s) => checkFile(g, 'screenshots', s))
  }

if (errors.length) {
  console.error('✖ Problemas en games.json:\n  - ' + errors.join('\n  - '))
  process.exit(1)
}
console.log(`✔ games.json OK (${games.length} juegos)`)
