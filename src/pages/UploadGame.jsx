import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Image as ImageIcon, Save } from 'lucide-react'
import { useGames } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'

export default function UploadGame() {
  const { addGame } = useGames()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    description_short: '',
    tags: '',
    author: '',
    version: '1.0.0',
    category: 'otros',
    download_url: '',
    game_url: '',
    cover_image: '',
    platform: 'windows',
  })
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const current = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      if (!current.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...current, tagInput.trim()].join(', ') }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    const current = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, tags: current.filter(t => t !== tagToRemove).join(', ') }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cover_image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await addGame(formData)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.message || 'Error al subir el juego')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <Save className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¡Juego publicado!</h2>
        <p className="text-gray-400">Tu juego está ahora disponible en la plataforma.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Subir Nuevo Juego</h1>
        <p className="text-gray-400">Comparte tu juego indie con la comunidad</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Título del Juego *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej: Cosmic Adventure"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Desarrollador</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Tu nombre o estudio"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-400 mb-1 block">Descripción Corta *</label>
          <textarea
            name="description_short"
            value={formData.description_short}
            onChange={handleInputChange}
            className="input-field"
            rows={2}
            placeholder="Breve descripción para la tarjeta (máx 150 caracteres)"
            maxLength={150}
            required
          />
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-400 mb-1 block">Descripción Completa</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input-field"
            rows={6}
            placeholder="Descripción detallada del juego, características, controles..."
          />
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-400 mb-1 block">Etiquetas</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="input-field flex-1"
              placeholder="Ej: Plataformas, Pixel Art"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags && formData.tags.split(',').map((tag, i) => {
              const t = tag.trim()
              if (!t) return null
              return (
                <span key={i} className="badge badge-purple flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-400">
                    <X size={12} />
                  </button>
                </span>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-400 mb-1 block">Imagen de portada</label>
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 transition">
            {formData.cover_image ? (
              <div className="relative">
                <img src={formData.cover_image} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon size={32} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-500 text-sm mb-3">Selecciona una imagen</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="coverInput"
                />
                <label
                  htmlFor="coverInput"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition cursor-pointer"
                >
                  <Upload size={16} />
                  Elegir imagen
                </label>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">URL de descarga</label>
            <input
              type="url"
              name="download_url"
              value={formData.download_url}
              onChange={handleInputChange}
              className="input-field"
              placeholder="https://ejemplo.com/descarga.zip"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">URL del juego online</label>
            <input
              type="url"
              name="game_url"
              value={formData.game_url}
              onChange={handleInputChange}
              className="input-field"
              placeholder="https://ejemplo.com/jugar"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="plataformas">Plataformas</option>
              <option value="puzzle">Puzzle</option>
              <option value="carreras">Carreras</option>
              <option value="rpg">RPG</option>
              <option value="accion">Acción</option>
              <option value="aventura">Aventura</option>
              <option value="simulacion">Simulación</option>
              <option value="terror">Terror</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Plataforma</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
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
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              className="input-field"
              placeholder="1.0.0"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary mt-8 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload size={20} />
          {loading ? 'Publicando...' : 'Publicar Juego'}
        </button>
      </form>
    </div>
  )
}
