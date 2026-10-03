import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useGames } from '../context/GameContext'
import EditGameModal from '../components/EditGameModal'

export default function AdminPanel() {
  const { games, addGame, updateGame, deleteGame, toggleVisible, importGames, resetGames } = useGames()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null) // null | 'new' | game
  const fileRef = useRef()

  const filtered = games.filter((g) => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || `${g.title} ${g.author}`.toLowerCase().includes(q)
    const matchS = status === 'all' || (status === 'visible' ? g.visible : !g.visible)
    return matchQ && matchS
  })

  const save = (data) => {
    if (editing === 'new') addGame(data)
    else updateGame(editing.id, data)
    setEditing(null)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(games, null, 2) + '\n'], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'games.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const list = JSON.parse(await file.text())
      if (!Array.isArray(list)) throw new Error()
      importGames(list)
    } catch {
      alert('Archivo no válido: debe ser un games.json con una lista de juegos.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <button className="btn-primary" onClick={() => setEditing('new')}>
          <Plus size={16} /> Añadir juego
        </button>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
        Los cambios se guardan en <strong>este navegador</strong>. Para publicarlos para todos los visitantes, pulsa{' '}
        <strong>Exportar</strong>, reemplaza <code>src/data/games.json</code> con el archivo descargado y vuelve a
        desplegar. Más detalles en el README.
      </div>

      <div className="flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input max-w-[10rem]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Todos</option>
          <option value="visible">Visibles</option>
          <option value="hidden">Ocultos</option>
        </select>
        <div className="ml-auto flex gap-2">
          <button className="btn-ghost" onClick={exportJson}>
            <Download size={16} /> Exportar
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current.click()}>
            <Upload size={16} /> Importar
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
          <button
            className="btn-ghost"
            title="Volver a los juegos de games.json"
            onClick={() => confirm('¿Descartar los cambios locales y volver a games.json?') && resetGames()}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Autor</th>
              <th className="p-3">Versión</th>
              <th className="p-3">Descargas</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-slate-800">
                <td className="p-3 font-medium">
                  <Link to={`/juego/${g.id}`} className="hover:text-violet-400">
                    {g.title}
                  </Link>
                </td>
                <td className="p-3 text-slate-400">{g.author}</td>
                <td className="p-3 text-slate-400">{g.version}</td>
                <td className="p-3 text-slate-400">{g.downloads || 0}</td>
                <td className="p-3">
                  <span className={g.visible ? 'text-emerald-400' : 'text-slate-500'}>{g.visible ? 'Visible' : 'Oculto'}</span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button className="btn-ghost !px-2" title="Mostrar/ocultar" onClick={() => toggleVisible(g.id)}>
                      {g.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button className="btn-ghost !px-2" title="Editar" onClick={() => setEditing(g)}>
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn-danger !px-2"
                      title="Eliminar"
                      onClick={() => confirm(`¿Eliminar "${g.title}"?`) && deleteGame(g.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No hay juegos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditGameModal game={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
