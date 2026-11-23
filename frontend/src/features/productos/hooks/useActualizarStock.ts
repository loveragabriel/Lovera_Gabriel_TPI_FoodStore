import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarStock } from '../api/productos'
import type { StockInput } from '../types/producto.types'

export function useActualizarStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StockInput }) => actualizarStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
