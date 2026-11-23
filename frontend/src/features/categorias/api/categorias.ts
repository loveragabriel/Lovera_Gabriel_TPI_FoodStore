import { api } from '@/shared/api/axiosInstance'

import type { Categoria, CategoriaInput } from '../types/categoria.types'

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/categorias')
  return response.data
}

export async function crearCategoria(data: CategoriaInput): Promise<Categoria> {
  const response = await api.post<Categoria>('/categorias', data)
  return response.data
}

export async function actualizarCategoria(id: number, data: Partial<CategoriaInput>): Promise<Categoria> {
  const response = await api.put<Categoria>(`/categorias/${id}`, data)
  return response.data
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`)
}
