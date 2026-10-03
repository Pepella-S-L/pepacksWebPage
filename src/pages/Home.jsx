import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useGames } from '../context/GameContext'
import GameCard from '../components/GameCard'

export default function Home() {
  const { games } = useGames()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  const visible = useMemo(() => games.filter((g) => g.visible), [games])
  const tags = useMemo(() => [...new Set(visible.flatMap((g) => g.tags || []))].sort(), [visible])

  const filtered = visible.filter((g) => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || `${g.title} ${g.author} ${g.description}`.toLowerCase().includes(q)
    const matchTag = !activeTag || g.tags?.includes(activeTag)
    return matchQ && matchTag
  })

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          Descubre juegos indie
        </h1>
        <p className="mt-3 text-slate-400">Juega online o descarga los mejores juegos independientes.</p>
      </section>

      <div className="space-y-4">
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input
            className="input pl-10"
            placeholder="Buscar por título, autor o descripción..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-3 py-1 text-sm ${!activeTag ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Todos
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                className={`rounded-full px-3 py-1 text-sm ${t === activeTag ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-slate-500">No hay juegos que coincidan.</p>
      )}
    </div>
  )
}
