import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Gamepad2, Menu, X, User, LogOut, Shield } from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Pepacks</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin() && (
                  <Link to="/admin" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Log In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  {isAdmin() && (
                    <Link to="/admin" className="text-purple-400 hover:text-purple-300 py-2" onClick={() => setMobileMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 py-2 text-left">
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2 px-4 text-center" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
