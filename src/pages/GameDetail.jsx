import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Play, User, Tag, Calendar } from 'lucide-react'
import { useGames } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import { assetUrl } from '../utils'

export default function GameDetail() {
  const { id } = useParams()
  const { games, registerDownload } = useGames()
  const { isAuthenticated } = useAuth()
  const [playing, setPlaying] = useState(false)
  const game = games.find((g) => g.id === id)

  if (!game || (!game.visible && !isAuthenticated)) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-slate-400">Juego no encontrado.</p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Volver
      </Link>

      {playing && game.playUrl ? (
        <div className="space-y-2">
          <iframe
            src={assetUrl(game.playUrl)}
            title={game.title}
            allowFullScreen
            className="aspect-video w-full rounded-xl border border-slate-800 bg-black"
          />
          <button className="btn-ghost" onClick={() => setPlaying(false)}>
            Cerrar juego
          </button>
        </div>
      ) : (
        <img
          src={assetUrl(game.cover || 'covers/placeholder.svg')}
          alt={game.title}
          className="aspect-video w-full rounded-xl border border-slate-800 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = assetUrl('covers/placeholder.svg')
          }}
        />
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h1 className="text-3xl font-extrabold">
            {game.title} {!game.visible && <span className="tag ml-2">Oculto</span>}
          </h1>
          <p className="whitespace-pre-line text-slate-300">{game.description}</p>
          <div className="flex flex-wrap gap-2">
            {game.tags?.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><User size={14} /> {game.author || '—'}</li>
            <li className="flex items-center gap-2"><Tag size={14} /> Versión {game.version || '—'}</li>
            <li className="flex items-center gap-2"><Calendar size={14} /> {game.createdAt || '—'}</li>
            <li className="flex items-center gap-2"><Download size={14} /> {game.downloads || 0} descargas</li>
          </ul>
          {game.playUrl && (
            <button className="btn-primary w-full" onClick={() => setPlaying(true)}>
              <Play size={16} /> Jugar ahora
            </button>
          )}
          {game.downloadUrl ? (
            <a
              href={assetUrl(game.downloadUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full"
              onClick={() => registerDownload(game.id)}
            >
              <Download size={16} /> Descargar
            </a>
          ) : (
            !game.playUrl && <p className="text-sm text-slate-500">Descarga no disponible todavía.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
