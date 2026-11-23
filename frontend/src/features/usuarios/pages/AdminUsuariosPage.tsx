import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { Usuario } from '@/features/auth/types/auth.types'
import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { Button } from '@/shared/ui/Button'
import { useAuthStore } from '@/store/authStore'

import { useActivarUsuario } from '../hooks/useActivarUsuario'
import { useDesactivarUsuario } from '../hooks/useDesactivarUsuario'
import { useUsuarios } from '../hooks/useUsuarios'

const columnHelper = createColumnHelper<Usuario>()

export function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((s) => s.usuario)
  const { data, isLoading, isError, refetch } = useUsuarios()
  const activarUsuario = useActivarUsuario()
  const desactivarUsuario = useDesactivarUsuario()

  const columns = [
    columnHelper.accessor('username', { header: 'Usuario' }),
    columnHelper.accessor('full_name', { header: 'Nombre' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('role', { header: 'Rol' }),
    columnHelper.accessor('disabled', {
      header: 'Estado',
      cell: (info) => (info.getValue() ? 'Desactivado' : 'Activo'),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => {
        const usuario = info.row.original
        const esUsuarioActual = usuario.id === usuarioActual?.id

        return (
          <div className="flex gap-2">
            {usuario.disabled ? (
              <Button variant="outline" onClick={() => activarUsuario.mutate(usuario.id)}>
                Activar
              </Button>
            ) : (
              !esUsuarioActual && (
                <Button variant="danger" onClick={() => desactivarUsuario.mutate(usuario.id)}>
                  Desactivar
                </Button>
              )
            )}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>

      {isLoading && <Skeleton count={5} className="h-12" />}
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
    </div>
  )
}
