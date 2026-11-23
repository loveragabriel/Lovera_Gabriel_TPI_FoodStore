import { useState } from 'react'

import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { Skeleton } from '@/shared/components/Skeleton'

import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const LIMIT = 8

export function CatalogoPage() {
  const [pagina, setPagina] = useState(1)
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const { data: categorias } = useCategorias()
  const { data, isLoading, isError, refetch } = useProductos({
    skip: (pagina - 1) * LIMIT,
    limit: LIMIT,
    search: search || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Catalogo</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPagina(1)
          }}
          placeholder="Buscar productos..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
        />
        <select
          value={categoriaId ?? ''}
          onChange={(e) => {
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined)
            setPagina(1)
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
        >
          <option value="">Todas las categorias</option>
          {categorias?.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton count={8} className="h-64" />
        </div>
      )}

      {!isLoading && isError && <EstadoError onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EstadoVacio mensaje="No hay productos para mostrar." />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
        </>
      )}
    </div>
  )
}
