import { api } from '@/shared/api/axiosInstance'

import type { FiltrosProductos, ProductosPaginados } from '../types/producto.types'

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const response = await api.get<ProductosPaginados>('/productos', { params: filtros })
  return response.data
}
