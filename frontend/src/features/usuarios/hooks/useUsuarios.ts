import { useQuery } from '@tanstack/react-query'

import { listarUsuarios } from '../api/usuarios'

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: listarUsuarios,
  })
}
