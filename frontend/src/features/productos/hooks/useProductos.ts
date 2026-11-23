import { useQuery } from '@tanstack/react-query'

import { listarProductos } from '../api/productos'
import type { FiltrosProductos } from '../types/producto.types'

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => listarProductos(filtros),
    placeholderData: (previousData) => previousData,
  })
}
