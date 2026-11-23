import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidadCarrito = useCartStore((s) => s.items.reduce((total, item) => total + item.cantidad, 0))
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
      <Link to="/" className="text-lg font-bold text-brand">
        Food Store
      </Link>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <Link to="/" className="text-gray-700 hover:text-brand">
          Catalogo
        </Link>
        <Link to="/carrito" className="text-gray-700 hover:text-brand">
          Carrito{cantidadCarrito > 0 && ` (${cantidadCarrito})`}
        </Link>

        {usuario ? (
          <>
            <Link to="/mis-pedidos" className="text-gray-700 hover:text-brand">
              Mis pedidos
            </Link>
            {usuario.role === 'admin' && (
              <Link to="/admin/resumen" className="text-gray-700 hover:text-brand">
                Panel admin
              </Link>
            )}
            <span className="text-gray-500">{usuario.full_name}</span>
            <button type="button" onClick={handleLogout} className="text-gray-700 hover:text-brand">
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-brand">
              Ingresar
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-brand">
              Registrarme
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
