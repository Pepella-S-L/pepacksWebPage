import { useState, useEffect } from 'react'
import { X, Upload, Save, Tag } from 'lucide-react'

export default function EditGameModal({ game, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    description_short: '',
    version: '1.0',
    author: '',
    category: 'otros',
    tags: '',
    cover_image: '',
    download_url: '',
    game_url: '',
    file_size: 0,
    platform: 'windows',
    is_featured: false,
    is_visible: true,
  })

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || '',
        description: game.description || '',
        description_short: game.description_short || '',
        version: game.version || '1.0',
        author: game.author || '',
        category: game.category || 'otros',
        tags: game.tags?.join(', ') || '',
        cover_image: game.cover_image || '',
        download_url: game.download_url || '',
        game_url: game.game_url || '',
        file_size: game.file_size || 0,
        platform: game.platform || 'windows',
        is_featured: game.is_featured || false,
        is_visible: game.is_visible !== false,
      })
    }
  }, [game])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    onSave(data)
  }

  const categories = ['plataformas', 'puzzle', 'carreras', 'rpg', 'accion', 'aventura', 'simulacion', 'terror', 'otros']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {game ? 'Editar Juego' : 'Nuevo Juego'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Autor</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Descripción corta</label>
            <input
              type="text"
              value={formData.description_short}
              onChange={(e) => setFormData({ ...formData, description_short: e.target.value })}
              className="input-field"
              placeholder="Resumen breve (máx 150 caracteres)"
              maxLength={150}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Descripción completa *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[120px]"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Plataforma</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="input-field"
              >
                <option value="windows">Windows</option>
                <option value="mac">macOS</option>
                <option value="linux">Linux</option>
                <option value="web">Web</option>
                <option value="multi">Multiplataforma</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Versión</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Etiquetas (separadas por coma)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input-field"
              placeholder="Aventura, Acción, Indie"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">URL de la imagen de portada</label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="input-field"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">URL de descarga</label>
              <input
                type="url"
                value={formData.download_url}
                onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                className="input-field"
                placeholder="https://ejemplo.com/descarga.zip"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">URL del juego online</label>
              <input
                type="url"
                value={formData.game_url}
                onChange={(e) => setFormData({ ...formData, game_url: e.target.value })}
                className="input-field"
                placeholder="https://ejemplo.com/jugar"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm text-gray-300">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm text-gray-300">Visible</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {game ? 'Guardar cambios' : 'Crear juego'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
