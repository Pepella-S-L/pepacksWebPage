// Modelo de datos de un juego y utilidades compartidas.
export const PLATFORMS = ['Web', 'Windows', 'Mac', 'Linux', 'Android']

export const EMPTY_GAME = {
  title: '',
  description: '',
  tags: [],
  platforms: [],
  author: '',
  version: '1.0.0',
  cover: '',
  screenshots: [],
  downloadUrl: '',
  playUrl: '',
  featured: false,
  visible: true,
}

export const splitList = (text) =>
  text
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean)

// Normaliza un juego importado/antiguo para que nunca falten campos.
export function normalizeGame(g) {
  return { ...EMPTY_GAME, createdAt: '', ...g, tags: g.tags ?? [], platforms: g.platforms ?? [], screenshots: g.screenshots ?? [] }
}

export function isValidCatalog(list) {
  return Array.isArray(list) && list.every((g) => g && typeof g.id === 'string' && typeof g.title === 'string')
}
