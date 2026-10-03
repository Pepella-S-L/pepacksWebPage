import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// HashRouter: las rutas funcionan en cualquier hosting estático sin configurar redirecciones.
export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/juego/:id" element={<GameDetail />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </GameProvider>
    </AuthProvider>
  )
}
