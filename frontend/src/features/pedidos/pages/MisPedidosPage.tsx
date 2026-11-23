import { useState } from 'react'

import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { Skeleton } from '@/shared/components/Skeleton'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { Button } from '@/shared/ui/Button'

import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'

const LIMIT = 10

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(1)
  const { data, isLoading, isError, refetch } = usePedidos({ skip: (pagina - 1) * LIMIT, limit: LIMIT })
  const cancelarPedido = useCancelarPedido()

  const totalPaginas = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>

      {isLoading && <Skeleton count={3} className="h-32" />}
      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.items.length === 0 && (
        <EstadoVacio mensaje="Todavia no hiciste ningun pedido." />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <div className="space-y-4">
            {data.items.map((pedido) => (
              <div key={pedido.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">Pedido #{pedido.id}</p>
                    <p className="text-sm text-gray-500">{new Date(pedido.created_at).toLocaleString('es-AR')}</p>
                  </div>
                  <BadgeEstado estado={pedido.estado} />
                </div>

                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  {pedido.items.map((item) => (
                    <li key={item.producto_id} className="flex justify-between">
                      <span>
                        {item.cantidad} x {item.nombre_producto}
                      </span>
                      <span>${item.subtotal.toLocaleString('es-AR')}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="font-semibold">Total: ${pedido.total.toLocaleString('es-AR')}</span>
                  {pedido.estado === 'PENDIENTE' && (
                    <Button
                      variant="outline"
                      disabled={cancelarPedido.isPending}
                      onClick={() => cancelarPedido.mutate(pedido.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
        </>
      )}
    </div>
  )
}
