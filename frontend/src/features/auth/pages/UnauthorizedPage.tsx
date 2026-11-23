import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acceso denegado</h1>
      <p className="text-gray-600">No tenes permisos para ver esta pagina.</p>
      <Link to="/" className="text-brand hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
