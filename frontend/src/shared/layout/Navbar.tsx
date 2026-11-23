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
    <nav className="border-b border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-lg font-bold text-brand">
          Food Store
        </Link>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <Link to="/" className="text-gray-700 hover:text-brand">
            Catalogo
          </Link>
          {usuario?.role !== 'admin' && (
            <Link to="/carrito" className="text-gray-700 hover:text-brand">
              Carrito{cantidadCarrito > 0 && ` (${cantidadCarrito})`}
            </Link>
          )}

          {usuario ? (
            <>
              {usuario.role !== 'admin' && (
                <Link to="/mis-pedidos" className="text-gray-700 hover:text-brand">
                  Mis pedidos
                </Link>
              )}
              {usuario.role === 'admin' && (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  Admin
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-gray-700 hover:text-brand"
              >
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
      </div>

      {usuario?.role === 'admin' && (
        <div className="flex flex-wrap items-center gap-5 border-t border-gray-100 bg-gray-50 px-6 py-2 text-sm">
          <Link to="/admin/resumen" className="text-gray-600 hover:text-brand">
            Resumen
          </Link>
          <Link to="/admin/categorias" className="text-gray-600 hover:text-brand">
            Categorias
          </Link>
          <Link to="/admin/productos" className="text-gray-600 hover:text-brand">
            Productos
          </Link>
          <Link to="/admin/pedidos" className="text-gray-600 hover:text-brand">
            Pedidos
          </Link>
          <Link to="/admin/usuarios" className="text-gray-600 hover:text-brand">
            Usuarios
          </Link>
        </div>
      )}
    </nav>
  )
}
