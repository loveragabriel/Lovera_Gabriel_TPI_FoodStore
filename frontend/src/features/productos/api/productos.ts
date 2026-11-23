import { api } from '@/shared/api/axiosInstance'

import type { FiltrosProductos, Producto, ProductoInput, ProductosPaginados, StockInput } from '../types/producto.types'

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const response = await api.get<ProductosPaginados>('/productos', { params: filtros })
  return response.data
}

export async function crearProducto(data: ProductoInput): Promise<Producto> {
  const response = await api.post<Producto>('/productos', data)
  return response.data
}

export async function actualizarProducto(id: number, data: Partial<ProductoInput>): Promise<Producto> {
  const response = await api.put<Producto>(`/productos/${id}`, data)
  return response.data
}

export async function actualizarStock(id: number, data: StockInput): Promise<Producto> {
  const response = await api.patch<Producto>(`/productos/${id}/stock`, data)
  return response.data
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}
