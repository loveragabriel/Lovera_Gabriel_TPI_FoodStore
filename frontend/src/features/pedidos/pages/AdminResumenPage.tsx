import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { Card } from '@/shared/ui/Card'

import { useResumenPedidos } from '../hooks/useResumenPedidos'

export function AdminResumenPage() {
  const { data, isLoading, isError, refetch } = useResumenPedidos()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Skeleton count={6} className="h-28" />
        </div>
      )}

      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}

      {!isLoading && !isError && data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card title="Pendientes">
            <p className="text-3xl font-bold text-brand">{data.pendientes}</p>
          </Card>
          <Card title="En preparacion">
            <p className="text-3xl font-bold text-brand">{data.en_preparacion}</p>
          </Card>
          <Card title="Entregados">
            <p className="text-3xl font-bold text-brand">{data.entregados}</p>
          </Card>
          <Card title="Cancelados">
            <p className="text-3xl font-bold text-brand">{data.cancelados}</p>
          </Card>
          <Card title="Pedidos de hoy">
            <p className="text-3xl font-bold text-brand">{data.pedidos_hoy}</p>
          </Card>
          <Card title="Ingresos entregados">
            <p className="text-3xl font-bold text-brand">${data.ingresos_entregados.toLocaleString('es-AR')}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
