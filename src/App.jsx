import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import { CookieBanner, CookiePreferencesModal } from './components/CookieConsent'
import Layout from './components/Layout'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import { useEffect } from 'react'

function AppContent() {
  const { checkAuth } = useAuth()
  useEffect(() => { checkAuth() }, [checkAuth])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <CookieBanner />
      <CookiePreferencesModal />
    </Layout>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
