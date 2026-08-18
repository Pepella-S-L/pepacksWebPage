import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'  // Import Tailwind CSS
import { AuthProvider, useAuth } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import { CookieBanner, CookiePreferencesModal } from './components/CookieConsent'
import Layout from './components/Layout'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import { useEffect } from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('App Error:', error, errorInfo)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0f0f1a', color: '#ef4444', padding: '40px', fontFamily: 'monospace' }}>
          <h1>Error:</h1>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

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
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
