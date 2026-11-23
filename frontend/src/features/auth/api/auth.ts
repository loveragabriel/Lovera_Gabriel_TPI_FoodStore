import { api } from '@/shared/api/axiosInstance'

import type { RegistroInput, Usuario } from '../types/auth.types'

export async function register(data: RegistroInput): Promise<Usuario> {
  const response = await api.post<Usuario>('/auth/register', data)
  return response.data
}

export async function login(username: string, password: string): Promise<void> {
  await api.post('/auth/token', new URLSearchParams({ username, password }))
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function me(): Promise<Usuario> {
  const response = await api.get<Usuario>('/auth/me')
  return response.data
}
