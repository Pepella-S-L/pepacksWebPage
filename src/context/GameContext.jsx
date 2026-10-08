import { createContext, useContext, useEffect, useState } from 'react'
import seed from '../data/games.json'
import { useAuth } from './AuthContext'
import { slugify } from '../utils'
import { isValidCatalog, normalizeGame } from '../lib/games'

const GameContext = createContext(null)
const KEY = 'igh_games_draft'
const published = seed.map(normalizeGame)

function loadDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return isValidCatalog(raw) ? raw.map(normalizeGame) : null
  } catch {
    return null
  }
}

/**
 * Los visitantes SIEMPRE ven src/data/games.json (lo publicado).
 * El admin edita un "borrador" guardado en su navegador; no afecta a nadie
 * hasta que lo exporta y lo sustituye en el repo.
 */
export function GameProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [draft, setDraft] = useState(loadDraft)

  useEffect(() => {
    try {
      if (draft) localStorage.setItem(KEY, JSON.stringify(draft))
      else localStorage.removeItem(KEY)
    } catch {}
  }, [draft])

  const games = isAuthenticated && draft ? draft : published
  const hasDraft = isAuthenticated && !!draft

  const mutate = (fn) => setDraft((prev) => fn(prev ?? published))

  const uniqueId = (title) => {
    const base = slugify(title)
    let id = base
    let n = 2
    while (games.some((g) => g.id === id)) id = `${base}-${n++}`
    return id
  }

  const addGame = (data) =>
    mutate((list) => [
      normalizeGame({ createdAt: new Date().toISOString().slice(0, 10), ...data, id: uniqueId(data.title) }),
      ...list,
    ])
  const updateGame = (id, data) => mutate((list) => list.map((g) => (g.id === id ? { ...g, ...data } : g)))
  const deleteGame = (id) => mutate((list) => list.filter((g) => g.id !== id))
  const toggleVisible = (id) => mutate((list) => list.map((g) => (g.id === id ? { ...g, visible: !g.visible } : g)))
  const importGames = (list) => setDraft(list.map(normalizeGame))
  const resetGames = () => setDraft(null)

  return (
    <GameContext.Provider
      value={{ games, hasDraft, addGame, updateGame, deleteGame, toggleVisible, importGames, resetGames }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGames = () => useContext(GameContext)
