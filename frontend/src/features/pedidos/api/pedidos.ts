import { api } from '@/shared/api/axiosInstance'

import type { Pedido, PedidoInput, PedidosPaginados, ResumenPedidos } from '../types/pedido.types'

export async function crearPedido(data: PedidoInput): Promise<Pedido> {
  const response = await api.post<Pedido>('/pedidos', data)
  return response.data
}

export async function listarPedidos(params: {
  skip: number
  limit: number
  estado?: string
}): Promise<PedidosPaginados> {
  const response = await api.get<PedidosPaginados>('/pedidos', { params })
  return response.data
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const response = await api.get<Pedido>(`/pedidos/${id}`)
  return response.data
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const response = await api.patch<Pedido>(`/pedidos/${id}/cancelar`)
  return response.data
}

export async function cambiarEstadoPedido(id: number, estado: string): Promise<Pedido> {
  const response = await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })
  return response.data
}

export async function obtenerResumen(): Promise<ResumenPedidos> {
  const response = await api.get<ResumenPedidos>('/pedidos/resumen')
  return response.data
}
