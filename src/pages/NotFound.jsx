import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-4 text-slate-400">Esta página no existe.</p>
      <Link to="/" className="btn-primary">Ir al inicio</Link>
    </div>
  )
}
