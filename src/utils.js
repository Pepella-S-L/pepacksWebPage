// Resuelve rutas locales ("games/foo.zip") respecto a la base del sitio,
// y deja intactas las URLs absolutas (https://...).
export function assetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, '')
}

export function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'juego'
  )
}
