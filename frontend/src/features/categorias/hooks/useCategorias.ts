import { useQuery } from '@tanstack/react-query'

import { listarCategorias } from '../api/categorias'

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  })
}
