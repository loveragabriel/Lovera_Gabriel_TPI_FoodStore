import type { Usuario } from '@/features/auth/types/auth.types'
import { api } from '@/shared/api/axiosInstance'

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>('/admin/usuarios')
  return response.data
}

export async function activarUsuario(id: number): Promise<Usuario> {
  const response = await api.post<Usuario>(`/admin/usuarios/${id}/activar`)
  return response.data
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
  const response = await api.post<Usuario>(`/admin/usuarios/${id}/desactivar`)
  return response.data
}
