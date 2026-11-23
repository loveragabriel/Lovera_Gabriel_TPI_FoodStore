import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { Button } from '@/shared/ui/Button'

import { ProductoFormModal } from '../components/ProductoFormModal'
import { StockModal } from '../components/StockModal'
import { useActualizarProducto } from '../hooks/useActualizarProducto'
import { useActualizarStock } from '../hooks/useActualizarStock'
import { useCrearProducto } from '../hooks/useCrearProducto'
import { useEliminarProducto } from '../hooks/useEliminarProducto'
import { useProductos } from '../hooks/useProductos'
import type { Producto } from '../types/producto.types'

const columnHelper = createColumnHelper<Producto>()

export function AdminProductosPage() {
  const { data, isLoading, isError, refetch } = useProductos({ skip: 0, limit: 100 })
  const crearProducto = useCrearProducto()
  const actualizarProducto = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminarProducto = useEliminarProducto()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [stockModalAbierto, setStockModalAbierto] = useState(false)
  const [productoStock, setProductoStock] = useState<Producto | null>(null)
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null)

  const columns = [
    columnHelper.accessor('nombre', { header: 'Nombre' }),
    columnHelper.accessor((row) => row.categoria.nombre, { id: 'categoria', header: 'Categoria' }),
    columnHelper.accessor('precio_base', {
      header: 'Precio',
      cell: (info) => `$${info.getValue().toLocaleString('es-AR')}`,
    }),
    columnHelper.accessor('stock', { header: 'Stock' }),
    columnHelper.accessor('disponible', {
      header: 'Disponible',
      cell: (info) => (info.getValue() ? 'Si' : 'No'),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setProductoStock(info.row.original)
              setStockModalAbierto(true)
            }}
          >
            Stock
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setProductoEditando(info.row.original)
              setModalAbierto(true)
            }}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => setProductoAEliminar(info.row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Button
          onClick={() => {
            setProductoEditando(null)
            setModalAbierto(true)
          }}
        >
          Nuevo producto
        </Button>
      </div>

      {isLoading && <Skeleton count={5} className="h-12" />}
      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 font-semibold text-gray-700">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
            </span>
            <Button variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
              Siguiente
            </Button>
          </div>
        </>
      )}

      <ProductoFormModal
        open={modalAbierto}
        producto={productoEditando}
        onClose={() => setModalAbierto(false)}
        onSubmit={(data) =>
          productoEditando
            ? actualizarProducto.mutateAsync({ id: productoEditando.id, data })
            : crearProducto.mutateAsync(data)
        }
      />

      <StockModal
        open={stockModalAbierto}
        producto={productoStock}
        onClose={() => setStockModalAbierto(false)}
        onSubmit={(data) =>
          productoStock ? actualizarStock.mutateAsync({ id: productoStock.id, data }) : Promise.resolve()
        }
      />

      <ConfirmDialog
        open={productoAEliminar !== null}
        mensaje={`Dar de baja "${productoAEliminar?.nombre}"?`}
        onCancel={() => setProductoAEliminar(null)}
        onConfirm={() => {
          if (productoAEliminar) eliminarProducto.mutate(productoAEliminar.id)
          setProductoAEliminar(null)
        }}
      />
    </div>
  )
}
