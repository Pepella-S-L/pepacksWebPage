import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const KEY = 'igh_auth'

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin'
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'admin123'

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuth] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  const login = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      try {
        localStorage.setItem(KEY, '1')
      } catch {}
      setAuth(true)
      return true
    }
    return false
  }

  const logout = () => {
    try {
      localStorage.removeItem(KEY)
    } catch {}
    setAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
