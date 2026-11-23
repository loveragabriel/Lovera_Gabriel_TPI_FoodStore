import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarCategoria } from '../api/categorias'
import type { CategoriaInput } from '../types/categoria.types'

export function useActualizarCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriaInput> }) => actualizarCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
