import { useState } from 'react'
import { X } from 'lucide-react'

const EMPTY = {
  title: '',
  description: '',
  tags: '',
  author: '',
  version: '1.0.0',
  cover: '',
  downloadUrl: '',
  playUrl: '',
}

export default function EditGameModal({ game, onSave, onClose }) {
  const [form, setForm] = useState(game ? { ...EMPTY, ...game, tags: (game.tags || []).join(', ') } : EMPTY)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      title: form.title.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
  }

  const Field = ({ label, hint, children }) => (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{game ? 'Editar juego' : 'Nuevo juego'}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <Field label="Título *">
          <input className="input" required value={form.title} onChange={set('title')} />
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
        <Field label="Portada" hint="Ruta en /public (covers/mi-juego.png) o URL completa">
          <input className="input" value={form.cover} onChange={set('cover')} />
        </Field>
        <Field label="Archivo de descarga" hint="Ruta en /public (games/mi-juego.zip) o URL (itch.io, Drive, GitHub Releases...)">
          <input className="input" value={form.downloadUrl} onChange={set('downloadUrl')} />
        </Field>
        <Field label="URL para jugar online (opcional)" hint="Juego HTML5: games/mi-juego/index.html o URL embebible">
          <input className="input" value={form.playUrl} onChange={set('playUrl')} />
        </Field>
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
