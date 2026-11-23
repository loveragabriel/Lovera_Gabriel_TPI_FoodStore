import { Link, useNavigate } from 'react-router-dom'

import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Button } from '@/shared/ui/Button'
import { useCartStore } from '@/store/cartStore'

export function CarritoPage() {
  const items = useCartStore((s) => s.items)
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const quitar = useCartStore((s) => s.quitar)
  const total = useCartStore((s) => s.total())
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito esta vacio." />
        <Link to="/" className="text-brand hover:underline">
          Volver al catalogo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Carrito</h1>

      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((item) => (
          <div key={item.producto_id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-gray-900">{item.nombre}</p>
              <p className="text-sm text-gray-500">${item.precio_unitario.toLocaleString('es-AR')} c/u</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.cantidad}
                onChange={(e) => cambiarCantidad(item.producto_id, Number(e.target.value))}
                className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm"
              />
              <span className="w-24 text-right font-semibold">
                ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
              </span>
              <button
                type="button"
                onClick={() => quitar(item.producto_id)}
                className="text-sm text-error hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold text-brand">${total.toLocaleString('es-AR')}</span>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/checkout')}>Confirmar pedido</Button>
      </div>
    </div>
  )
}
