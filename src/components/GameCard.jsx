import { Link } from 'react-router-dom'
import { Star, Download, Eye, User, Tag, Monitor } from 'lucide-react'

export default function GameCard({ game }) {
  const placeholderImage = `https://placehold.co/400x225/1a1a2e/a78bfa?text=${encodeURIComponent(game.title)}`

  return (
    <Link to={`/game/${game.id}`} className="group block">
      {/* Card Container */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-lg shadow-black/20 hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
        
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={game.cover_image || placeholderImage}
            alt={game.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
          
          {/* Platform Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs font-medium text-gray-300 border border-gray-600/50">
            {game.platform === 'windows' && 'Win'}
            {game.platform === 'mac' && 'Mac'}
            {game.platform === 'linux' && 'Linux'}
            {game.platform === 'web' && 'Web'}
            {game.platform === 'multi' && 'Multi'}
          </div>

          {/* Featured Badge */}
          {game.is_featured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 rounded-md text-xs font-bold text-amber-900 uppercase tracking-wide">
              Featured
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{game.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Description */}
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {game.description_short || game.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {game.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-xs text-purple-300 font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {game.downloads.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {game.views.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-amber-400">{game.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
