import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { assetUrl } from '../utils'

export default function GameCard({ game }) {
  return (
    <Link
      to={`/juego/${game.id}`}
      className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-violet-500/60"
    >
      <div className="aspect-video overflow-hidden bg-slate-800">
        <img
          src={assetUrl(game.cover || 'covers/placeholder.svg')}
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = assetUrl('covers/placeholder.svg')
          }}
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="truncate font-semibold">{game.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-400">{game.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {game.tags?.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>{game.author}</span>
          <span className="flex items-center gap-1">
            <Download size={12} /> {game.downloads || 0}
          </span>
        </div>
      </div>
    </Link>
  )
}
