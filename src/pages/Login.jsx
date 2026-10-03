import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const submit = (e) => {
    e.preventDefault()
    if (login(user, pass)) navigate('/admin')
    else setError(true)
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">Acceso administrador</h1>
      <input className="input" placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
      <input className="input" type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
      {error && <p className="text-sm text-red-400">Usuario o contraseña incorrectos.</p>}
      <button className="btn-primary w-full">Entrar</button>
    </form>
  )
}
