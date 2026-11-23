import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarProducto } from '../api/productos'
import type { ProductoInput } from '../types/producto.types'

export function useActualizarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoInput> }) => actualizarProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
