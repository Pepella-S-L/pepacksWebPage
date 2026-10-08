import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { assetUrl, COVER_FALLBACK, onImgError } from '../utils'

export default function GameCard({ game }) {
  return (
    <Link
      to={`/juego/${game.id}`}
      className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-violet-500/60"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={assetUrl(game.cover || COVER_FALLBACK)}
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={onImgError}
        />
        {game.featured && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
            <Star size={12} /> Destacado
          </span>
        )}
        {game.playUrl && (
          <span className="absolute bottom-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">Jugable</span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="truncate font-semibold">{game.title}</h3>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-slate-400">{game.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {game.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>{game.author}</span>
          <span>{game.platforms.join(' · ')}</span>
        </div>
      </div>
    </Link>
  )
}
