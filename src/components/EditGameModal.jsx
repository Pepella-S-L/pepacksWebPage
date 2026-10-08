import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { EMPTY_GAME, PLATFORMS, splitList } from '../lib/games'
import { assetUrl, onImgError } from '../utils'

// Definido FUERA del modal: si no, se recrea en cada render y los inputs pierden el foco.
function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export default function EditGameModal({ game, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    const g = { ...EMPTY_GAME, ...game }
    return { ...g, tags: g.tags.join(', '), screenshots: g.screenshots.join('\n') }
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const togglePlatform = (p) =>
    setForm({ ...form, platforms: form.platforms.includes(p) ? form.platforms.filter((x) => x !== p) : [...form.platforms, p] })

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      title: form.title.trim(),
      tags: splitList(form.tags),
      screenshots: splitList(form.screenshots),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label={game ? 'Editar juego' : 'Nuevo juego'}
        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{game ? 'Editar juego' : 'Nuevo juego'}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <Field label="Título *">
          <input className="input" required autoFocus value={form.title} onChange={set('title')} />
        </Field>
        <Field label="Descripción">
          <textarea className="input" rows={4} value={form.description} onChange={set('description')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Autor">
            <input className="input" value={form.author} onChange={set('author')} />
          </Field>
          <Field label="Versión">
            <input className="input" value={form.version} onChange={set('version')} />
          </Field>
        </div>
        <Field label="Etiquetas" hint="Separadas por comas: Aventura, Pixel Art">
          <input className="input" value={form.tags} onChange={set('tags')} />
        </Field>
        <div className="space-y-1">
          <span className="text-sm font-medium text-slate-300">Plataformas</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <label key={p} className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-300">
                <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} /> {p}
              </label>
            ))}
          </div>
        </div>
        <Field label="Portada" hint="Ruta en /public (covers/mi-juego.png) o URL completa">
          <input className="input" value={form.cover} onChange={set('cover')} />
        </Field>
        {form.cover && (
          <img src={assetUrl(form.cover)} alt="Vista previa de la portada" onError={onImgError} className="aspect-video w-40 rounded-lg object-cover" />
        )}
        <Field label="Capturas de pantalla" hint="Una ruta o URL por línea (opcional)">
          <textarea className="input" rows={3} value={form.screenshots} onChange={set('screenshots')} />
        </Field>
        <Field label="Archivo de descarga" hint="Ruta en /public (games/mi-juego.zip) o URL (itch.io, Drive, GitHub Releases...)">
          <input className="input" value={form.downloadUrl} onChange={set('downloadUrl')} />
        </Field>
        <Field label="URL para jugar online (opcional)" hint="Juego HTML5: games/mi-juego/index.html o URL embebible">
          <input className="input" value={form.playUrl} onChange={set('playUrl')} />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destacado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Visible
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  )
}
