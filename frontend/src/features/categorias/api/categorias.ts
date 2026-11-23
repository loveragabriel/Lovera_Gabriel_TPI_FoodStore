import { api } from '@/shared/api/axiosInstance'

import type { Categoria } from '../types/categoria.types'

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/categorias')
  return response.data
}
