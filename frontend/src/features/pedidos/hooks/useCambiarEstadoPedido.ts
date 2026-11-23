import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cambiarEstadoPedido } from '../api/pedidos'

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => cambiarEstadoPedido(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
