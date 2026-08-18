import { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import { Search, Sparkles } from 'lucide-react'
import { useGames } from '../context/GameContext'

export default function Home() {
  const { games, loading, error, pagination, fetchGames } = useGames()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  const sortOptions = [
    { value: 'created_at', label: 'Most Recent' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Alphabetical' },
  ]

  useEffect(() => {
    const params = {
      page: 1,
      per_page: 12,
      sort: sortBy,
      order: sortBy === 'title' ? 'asc' : 'desc',
    }
    if (searchTerm) params.search = searchTerm
    
    fetchGames(params)
  }, [searchTerm, sortBy, fetchGames])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-purple-900/40 via-gray-900 to-cyan-900/40 border-b border-purple-500/20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Indie Games
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover and play the best games from independent developers worldwide. 
            Your next adventure is just a click away.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all text-lg shadow-xl shadow-black/20"
            />
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              {searchTerm ? `Results for "${searchTerm}"` : 'All Games'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50">
                <div className="aspect-[16/9] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-3 skeleton w-full" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <p className="text-red-400 text-lg mb-2">Error loading games</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => fetchGames()} className="btn-primary">
              Retry
            </button>
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* Empty State */}
            {games.length === 0 && (
              <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <Sparkles className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
                <p className="text-gray-400">Try changing the filters or search for something different.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {[...Array(pagination.total_pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchGames({ page: i + 1 })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pagination.page === i + 1
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
