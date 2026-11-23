import { useState } from 'react'

import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { Skeleton } from '@/shared/components/Skeleton'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'

import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido } from '../types/pedido.types'

const SIGUIENTE_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'ENTREGADO',
}

const ESTADOS_CON_CANCELACION: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION']

const LIMIT = 10

export function AdminPedidosPage() {
  const [pagina, setPagina] = useState(1)
  const [estado, setEstado] = useState<string>('')
  const { data, isLoading, isError, refetch } = usePedidos({
    skip: (pagina - 1) * LIMIT,
    limit: LIMIT,
    estado: estado || undefined,
  })
  const cambiarEstado = useCambiarEstadoPedido()

  const totalPaginas = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

      <Select
        value={estado}
        onChange={(e) => {
          setEstado(e.target.value)
          setPagina(1)
        }}
      >
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="EN_PREPARACION">En preparacion</option>
        <option value="ENTREGADO">Entregado</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>

      {isLoading && <Skeleton count={5} className="h-16" />}
      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.items.length === 0 && (
        <EstadoVacio mensaje="No hay pedidos para mostrar." />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Pedido</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Usuario</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((pedido) => {
                  const siguienteEstado = SIGUIENTE_ESTADO[pedido.estado]
                  const puedeCancelar = ESTADOS_CON_CANCELACION.includes(pedido.estado)

                  return (
                    <tr key={pedido.id}>
                      <td className="px-4 py-3">#{pedido.id}</td>
                      <td className="px-4 py-3">Usuario #{pedido.usuario_id}</td>
                      <td className="px-4 py-3">{new Date(pedido.created_at).toLocaleDateString('es-AR')}</td>
                      <td className="px-4 py-3">${pedido.total.toLocaleString('es-AR')}</td>
                      <td className="px-4 py-3">
                        <BadgeEstado estado={pedido.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {siguienteEstado && (
                            <Button
                              variant="outline"
                              disabled={cambiarEstado.isPending}
                              onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: siguienteEstado })}
                            >
                              Avanzar
                            </Button>
                          )}
                          {puedeCancelar && (
                            <Button
                              variant="danger"
                              disabled={cambiarEstado.isPending}
                              onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: 'CANCELADO' })}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
        </>
      )}
    </div>
  )
}
