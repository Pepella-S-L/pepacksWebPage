import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Check, Download, Maximize, Play, Share2, Tag, User } from 'lucide-react'
import { useGames } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import GameCard from '../components/GameCard'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { assetUrl, COVER_FALLBACK, onImgError } from '../utils'

export default function GameDetail() {
  const { id } = useParams()
  const { games } = useGames()
  const { isAuthenticated } = useAuth()
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const frame = useRef()
  const game = games.find((g) => g.id === id)
  useDocumentTitle(game?.title)

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

  const related = games
    .filter((g) => g.visible && g.id !== game.id && g.tags.some((t) => game.tags.includes(t)))
    .slice(0, 3)

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: game.title, url: location.href })
      else {
        await navigator.clipboard.writeText(location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Volver
      </Link>

      {playing && game.playUrl ? (
        <div className="space-y-2">
          <iframe
            ref={frame}
            src={assetUrl(game.playUrl)}
            title={game.title}
            allow="fullscreen; gamepad; autoplay"
            allowFullScreen
            className="aspect-video w-full rounded-xl border border-slate-800 bg-black"
          />
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => frame.current?.requestFullscreen?.()}>
              <Maximize size={16} /> Pantalla completa
            </button>
            <button className="btn-ghost" onClick={() => setPlaying(false)}>
              Cerrar juego
            </button>
          </div>
        </div>
      ) : (
        <img
          src={assetUrl(game.cover || COVER_FALLBACK)}
          alt={game.title}
          className="aspect-video w-full rounded-xl border border-slate-800 object-cover"
          onError={onImgError}
        />
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h1 className="text-3xl font-extrabold">
            {game.title} {!game.visible && <span className="tag ml-2">Oculto</span>}
          </h1>
          <p className="whitespace-pre-line text-slate-300">{game.description}</p>
          <div className="flex flex-wrap gap-2">
            {game.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          {game.screenshots.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
              {game.screenshots.map((s) => (
                <a key={s} href={assetUrl(s)} target="_blank" rel="noopener noreferrer">
                  <img src={assetUrl(s)} alt={`Captura de ${game.title}`} loading="lazy" className="aspect-video rounded-lg border border-slate-800 object-cover transition hover:opacity-80" />
                </a>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><User size={14} /> {game.author || '—'}</li>
            <li className="flex items-center gap-2"><Tag size={14} /> Versión {game.version || '—'}</li>
            {game.createdAt && <li className="flex items-center gap-2"><Calendar size={14} /> {game.createdAt}</li>}
            {game.platforms.length > 0 && <li className="text-slate-400">Plataformas: {game.platforms.join(', ')}</li>}
          </ul>
          {game.playUrl && (
            <button className="btn-primary w-full" onClick={() => setPlaying(true)}>
              <Play size={16} /> Jugar ahora
            </button>
          )}
          {game.downloadUrl ? (
            <a href={assetUrl(game.downloadUrl)} download target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">
              <Download size={16} /> Descargar
            </a>
          ) : (
            !game.playUrl && <p className="text-sm text-slate-500">Descarga no disponible todavía.</p>
          )}
          <button className="btn-ghost w-full" onClick={share}>
            {copied ? <><Check size={16} /> Enlace copiado</> : <><Share2 size={16} /> Compartir</>}
          </button>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-bold">Juegos parecidos</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
