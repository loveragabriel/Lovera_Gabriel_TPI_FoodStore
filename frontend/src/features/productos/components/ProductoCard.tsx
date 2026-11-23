import { Button } from '@/shared/ui/Button'
import { useCartStore } from '@/store/cartStore'

import type { Producto } from '../types/producto.types'

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((s) => s.agregar)

  const sinStock = !producto.disponible || producto.stock <= 0

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-video w-full bg-gray-100">
        {producto.imagen_url && (
          <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-gray-500">{producto.categoria.nombre}</span>
        <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
        {producto.descripcion && <p className="line-clamp-2 text-sm text-gray-600">{producto.descripcion}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand">${producto.precio_base.toLocaleString('es-AR')}</span>
          <Button
            disabled={sinStock}
            onClick={() =>
              agregar({
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_base,
              })
            }
          >
            {sinStock ? 'Sin stock' : 'Agregar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
