import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { Button } from '@/shared/ui/Button'

import { CategoriaFormModal } from '../components/CategoriaFormModal'
import { useActualizarCategoria } from '../hooks/useActualizarCategoria'
import { useCategorias } from '../hooks/useCategorias'
import { useCrearCategoria } from '../hooks/useCrearCategoria'
import { useEliminarCategoria } from '../hooks/useEliminarCategoria'
import type { Categoria } from '../types/categoria.types'

const columnHelper = createColumnHelper<Categoria>()

export function AdminCategoriasPage() {
  const { data, isLoading, isError, refetch } = useCategorias()
  const crearCategoria = useCrearCategoria()
  const actualizarCategoria = useActualizarCategoria()
  const eliminarCategoria = useEliminarCategoria()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null)

  const columns = [
    columnHelper.accessor('nombre', { header: 'Nombre' }),
    columnHelper.accessor('descripcion', {
      header: 'Descripcion',
      cell: (info) => info.getValue() ?? '-',
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setCategoriaEditando(info.row.original)
              setModalAbierto(true)
            }}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => setCategoriaAEliminar(info.row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <Button
          onClick={() => {
            setCategoriaEditando(null)
            setModalAbierto(true)
          }}
        >
          Nueva categoria
        </Button>
      </div>

      {isLoading && <Skeleton count={4} className="h-12" />}
      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-semibold text-gray-700">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
      )}

      <CategoriaFormModal
        open={modalAbierto}
        categoria={categoriaEditando}
        onClose={() => setModalAbierto(false)}
        onSubmit={(data) =>
          categoriaEditando
            ? actualizarCategoria.mutateAsync({ id: categoriaEditando.id, data })
            : crearCategoria.mutateAsync(data)
        }
      />

      <ConfirmDialog
        open={categoriaAEliminar !== null}
        mensaje={`Dar de baja la categoria "${categoriaAEliminar?.nombre}"?`}
        onCancel={() => setCategoriaAEliminar(null)}
        onConfirm={() => {
          if (categoriaAEliminar) eliminarCategoria.mutate(categoriaAEliminar.id)
          setCategoriaAEliminar(null)
        }}
      />
    </div>
  )
}
