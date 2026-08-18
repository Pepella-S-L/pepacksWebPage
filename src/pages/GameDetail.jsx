import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Download, Eye, Star, ArrowLeft, Calendar, User, Tag, Monitor, ExternalLink, Heart } from 'lucide-react'
import { useGames } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getGameById } = useGames()
  const { user, isAuthenticated } = useAuth()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const foundGame = getGameById(id)
    if (foundGame) {
      setGame(foundGame)
    }
    setLoading(false)
  }, [id, getGameById])

  const handleDownload = async () => {
    if (game?.download_url) {
      window.open(game.download_url, '_blank')
    }
  }

  const placeholderImage = game ? `https://placehold.co/800x450/1a1a2e/a78bfa?text=${encodeURIComponent(game.title)}` : ''

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="aspect-video skeleton rounded-2xl" />
        <div className="h-8 skeleton w-1/2" />
        <div className="h-4 skeleton w-full" />
        <div className="h-4 skeleton w-3/4" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Hero Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
        <img
          src={game.cover_image || placeholderImage}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        
        {game.is_featured && (
          <div className="absolute top-4 left-4 badge bg-amber-500/90 text-amber-900 border-amber-400">
            Featured
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{game.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{game.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(game.created_at).toLocaleDateString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{game.rating.toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({game.rating_count} votes)</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl">
              <Download className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white">{game.downloads.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">downloads</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white">{game.views.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">views</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {game.description}
            </div>
          </div>

          {/* Tags */}
          {game.tags?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, i) => (
                  <span key={i} className="badge badge-purple">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download Card */}
          <div className="card p-6 sticky top-24">
            <div className="text-center space-y-4">
              {game.download_url && (
                <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download
                </button>
              )}
              
              {game.game_url && (
                <a
                  href={game.game_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Play Online
                </a>
              )}

              <button
                onClick={() => setLiked(!liked)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 transition-all ${
                  liked
                    ? 'border-red-500 text-red-400 bg-red-500/10'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-400' : ''}`} />
                {liked ? 'Liked!' : 'Like'}
              </button>
            </div>

            {/* Game Info */}
            <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Version</span>
                <span className="text-white font-medium">{game.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  {game.platform === 'windows' && 'Windows'}
                  {game.platform === 'mac' && 'macOS'}
                  {game.platform === 'linux' && 'Linux'}
                  {game.platform === 'web' && 'Browser'}
                  {game.platform === 'multi' && 'Multi-platform'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Size</span>
                <span className="text-white font-medium">
                  {game.file_size > 0 ? `${(game.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span className="text-white font-medium capitalize">{game.category.replace(/([A-Z])/g, ' $1')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
