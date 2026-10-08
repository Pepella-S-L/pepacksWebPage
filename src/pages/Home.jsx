import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useGames } from '../context/GameContext'
import GameCard from '../components/GameCard'
import useDocumentTitle from '../hooks/useDocumentTitle'

const SORTS = {
  recent: { label: 'Más recientes', fn: (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') },
  az: { label: 'A – Z', fn: (a, b) => a.title.localeCompare(b.title, 'es') },
}

export default function Home() {
  useDocumentTitle('')
  const { games } = useGames()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [sort, setSort] = useState('recent')

  const visible = useMemo(() => games.filter((g) => g.visible), [games])
  const tags = useMemo(() => [...new Set(visible.flatMap((g) => g.tags))].sort((a, b) => a.localeCompare(b, 'es')), [visible])
  const featured = useMemo(() => visible.filter((g) => g.featured), [visible])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visible
      .filter((g) => {
        const matchQ = !q || `${g.title} ${g.author} ${g.description} ${g.tags.join(' ')}`.toLowerCase().includes(q)
        return matchQ && (!activeTag || g.tags.includes(activeTag))
      })
      .sort(SORTS[sort].fn)
  }, [visible, query, activeTag, sort])

  const filtering = query.trim() || activeTag
  const showFeatured = !filtering && featured.length > 0
  const list = showFeatured ? filtered.filter((g) => !g.featured) : filtered

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          Descubre juegos indie
        </h1>
        <p className="mt-3 text-slate-400">
          Juega online o descarga los mejores juegos independientes · {visible.length} {visible.length === 1 ? 'juego' : 'juegos'}
        </p>
      </section>

      {showFeatured && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Destacados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[16rem] flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              className="input pl-10"
              type="search"
              aria-label="Buscar juegos"
              placeholder="Buscar por título, autor, etiqueta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input w-auto" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[null, ...tags].map((t) => (
              <button
                key={t ?? 'all'}
                onClick={() => setActiveTag(t)}
                aria-pressed={t === activeTag}
                className={`rounded-full px-3 py-1 text-sm ${t === activeTag ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {t ?? 'Todos'}
              </button>
            ))}
          </div>
        )}

        {showFeatured && list.length > 0 && <h2 className="pt-4 text-xl font-bold">Todos los juegos</h2>}
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        ) : showFeatured ? null : (
          <p className="py-16 text-center text-slate-500">
            {visible.length ? 'No hay juegos que coincidan.' : 'Aún no hay juegos publicados. ¡Vuelve pronto!'}
          </p>
        )}
      </section>
    </div>
  )
}
