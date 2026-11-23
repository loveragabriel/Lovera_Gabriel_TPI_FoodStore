import { useMutation, useQueryClient } from '@tanstack/react-query'

import { desactivarUsuario } from '../api/usuarios'

export function useDesactivarUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
