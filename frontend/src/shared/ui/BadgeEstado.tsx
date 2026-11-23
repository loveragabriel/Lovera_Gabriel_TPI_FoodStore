import type { EstadoPedido } from '@/features/pedidos/types/pedido.types'

const estadoClasses: Record<EstadoPedido, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  EN_PREPARACION: 'bg-blue-100 text-blue-800',
  ENTREGADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
}

const estadoLabels: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparacion',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${estadoClasses[estado]}`}>
      {estadoLabels[estado]}
    </span>
  )
}
