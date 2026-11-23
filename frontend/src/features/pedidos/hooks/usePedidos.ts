import { useQuery } from '@tanstack/react-query'

import { listarPedidos } from '../api/pedidos'

export function usePedidos(params: { skip: number; limit: number; estado?: string }) {
  return useQuery({
    queryKey: ['pedidos', params],
    queryFn: () => listarPedidos(params),
  })
}
