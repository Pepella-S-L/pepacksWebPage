import { Link, useNavigate } from 'react-router-dom'
import { Gamepad2, LogIn, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 p-1.5">
            <Gamepad2 size={20} />
          </span>
          Indie Games Hub
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="btn-ghost">
                <Settings size={16} /> Admin
              </Link>
              <button
                className="btn-ghost"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-ghost">
              <LogIn size={16} /> Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
