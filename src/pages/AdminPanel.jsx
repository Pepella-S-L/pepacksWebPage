import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, MoreVertical } from 'lucide-react'
import { useGames } from '../context/GameContext'
import EditGameModal from '../components/EditGameModal'

export default function AdminPanel() {
  const { games, loading, fetchGames, deleteGame, toggleVisibility, addGame, updateGame } = useGames()
  const [showModal, setShowModal] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionMenu, setActionMenu] = useState(null)

  useEffect(() => {
    fetchGames({ per_page: 100 })
  }, [fetchGames])

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (game) => {
    setEditingGame(game)
    setShowModal(true)
    setActionMenu(null)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this game?')) {
      await deleteGame(id)
    }
    setActionMenu(null)
  }

  const handleToggleVisibility = async (id) => {
    await toggleVisibility(id)
    setActionMenu(null)
  }

  const handleSave = async (gameData) => {
    if (editingGame) {
      await updateGame(editingGame.id, gameData)
    } else {
      await addGame(gameData)
    }
    setShowModal(false)
    setEditingGame(null)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1">Manage all games on the platform</p>
        </div>
        <button
          onClick={() => { setEditingGame(null); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Game
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Games Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Game</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Author</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Stats</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map(game => (
                <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                        {game.cover_image ? (
                          <img src={game.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{game.title}</p>
                        <p className="text-gray-500 text-xs">{game.version}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{game.author}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-purple capitalize">{game.category}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleVisibility(game.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        game.is_visible 
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                          : 'bg-gray-700/50 text-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      {game.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-400">
                    <div className="flex items-center justify-center gap-3">
                      <span title="Downloads">{game.downloads}↓</span>
                      <span title="Views">{game.views}👁</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActionMenu(actionMenu === game.id ? null : game.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {actionMenu === game.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                          <button
                            onClick={() => handleEdit(game)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGames.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No games found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditGameModal
          game={editingGame}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingGame(null) }}
        />
      )}
    </div>
  )
}
