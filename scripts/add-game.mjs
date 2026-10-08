// Añade un juego al catálogo copiando sus archivos a public/.
//
//   npm run add-game -- --title "Mi Juego" --author "Yo" --tags "Aventura,Pixel Art" \
//       --platforms "Windows,Web" --cover ./portada.png --file ./mi-juego.zip \
//       --description "Texto" [--play games/mi-juego/index.html] [--featured]
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, extname, join } from 'node:path'
import { parseArgs } from 'node:util'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { values: a } = parseArgs({
  options: {
    title: { type: 'string' },
    author: { type: 'string', default: '' },
    description: { type: 'string', default: '' },
    tags: { type: 'string', default: '' },
    platforms: { type: 'string', default: '' },
    version: { type: 'string', default: '1.0.0' },
    cover: { type: 'string' },
    file: { type: 'string' },
    play: { type: 'string', default: '' },
    url: { type: 'string', default: '' },
    featured: { type: 'boolean', default: false },
  },
})

if (!a.title) {
  console.error('Falta --title. Ejemplo: npm run add-game -- --title "Mi Juego" --file ./juego.zip')
  process.exit(1)
}

const slug =
  a.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'juego'
const list = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)

function copyIn(src, dir) {
  if (!src) return ''
  if (!existsSync(src)) {
    console.error(`✖ No existe el archivo: ${src}`)
    process.exit(1)
  }
  mkdirSync(join(root, 'public', dir), { recursive: true })
  const name = `${slug}${extname(src)}`
  copyFileSync(src, join(root, 'public', dir, name))
  return `${dir}/${name}`
}

const dataPath = join(root, 'src/data/games.json')
const games = JSON.parse(readFileSync(dataPath, 'utf8'))
if (games.some((g) => g.id === slug)) {
  console.error(`✖ Ya existe un juego con id "${slug}". Cambia el título o edita games.json.`)
  process.exit(1)
}

games.unshift({
  id: slug,
  title: a.title,
  description: a.description,
  tags: list(a.tags),
  platforms: list(a.platforms),
  author: a.author,
  version: a.version,
  cover: copyIn(a.cover, 'covers'),
  screenshots: [],
  downloadUrl: a.url || copyIn(a.file, 'games'),
  playUrl: a.play,
  featured: a.featured,
  visible: true,
  createdAt: new Date().toISOString().slice(0, 10),
})
writeFileSync(dataPath, JSON.stringify(games, null, 2) + '\n')
console.log(`✔ "${a.title}" añadido (${basename(dataPath)}). Haz commit y push para publicarlo.`)
