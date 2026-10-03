import { createContext, useContext, useEffect, useState } from 'react'
import seed from '../data/games.json'
import { slugify } from '../utils'

const GameContext = createContext(null)
const KEY = 'igh_games'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed
}

export function GameProvider({ children }) {
  const [games, setGames] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(games))
    } catch {}
  }, [games])

  const uniqueId = (title, ignoreId) => {
    const base = slugify(title)
    let id = base
    let n = 2
    while (games.some((g) => g.id === id && g.id !== ignoreId)) id = `${base}-${n++}`
    return id
  }

  const addGame = (data) =>
    setGames((prev) => [
      {
        downloads: 0,
        visible: true,
        createdAt: new Date().toISOString().slice(0, 10),
        ...data,
        id: uniqueId(data.title),
      },
      ...prev,
    ])

  const updateGame = (id, data) =>
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)))

  const deleteGame = (id) => setGames((prev) => prev.filter((g) => g.id !== id))

  const toggleVisible = (id) =>
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, visible: !g.visible } : g)))

  const registerDownload = (id) =>
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, downloads: (g.downloads || 0) + 1 } : g)))

  const importGames = (list) => setGames(list)
  const resetGames = () => setGames(seed)

  return (
    <GameContext.Provider
      value={{ games, addGame, updateGame, deleteGame, toggleVisible, registerDownload, importGames, resetGames }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGames = () => useContext(GameContext)
