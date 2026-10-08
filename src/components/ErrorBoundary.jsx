import { Component } from 'react'

// Evita la "pantalla en blanco": si algo falla, se muestra el error.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">Algo ha salido mal</h1>
        <p className="mb-4 text-slate-400">{String(this.state.error.message || this.state.error)}</p>
        <button className="btn-primary" onClick={() => location.reload()}>
          Recargar
        </button>
        <p className="mt-4 text-xs text-slate-500">
          Si persiste, borra los datos del sitio (localStorage) o pulsa «Restablecer» en el panel admin.
        </p>
      </div>
    )
  }
}
