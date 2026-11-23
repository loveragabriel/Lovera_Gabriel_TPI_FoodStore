import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import type { Producto, ProductoInput } from '../types/producto.types'

interface ProductoFormModalProps {
  open: boolean
  producto: Producto | null
  onClose: () => void
  onSubmit: (data: ProductoInput) => Promise<unknown>
}

export function ProductoFormModal({ open, producto, onClose, onSubmit }: ProductoFormModalProps) {
  const { data: categorias } = useCategorias()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? '',
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
      categoria_id: producto?.categoria_id ?? categorias?.[0]?.id ?? 0,
    } as ProductoInput,
    onSubmit: async ({ value, formApi }) => {
      setError(null)
      try {
        await onSubmit(value)
        formApi.reset()
        onClose()
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <Modal open={open} title={producto ? 'Editar producto' : 'Nuevo producto'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4"
      >
        <form.Field
          name="nombre"
          validators={{
            onBlur: ({ value }) => (value.trim().length === 0 ? 'El nombre es obligatorio' : undefined),
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              />
              {field.state.meta.errors.map((err) => (
                <p key={String(err)} className="text-xs text-error">
                  {String(err)}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Descripcion
              </label>
              <textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={2}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="categoria_id">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              >
                {categorias?.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="precio_base"
            validators={{
              onBlur: ({ value }) => (value < 0 ? 'El precio no puede ser negativo' : undefined),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                  Precio base
                </label>
                <input
                  id={field.name}
                  type="number"
                  min={0}
                  step="0.01"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-xs text-error">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field
            name="stock"
            validators={{
              onBlur: ({ value }) => (value < 0 ? 'El stock no puede ser negativo' : undefined),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  id={field.name}
                  type="number"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-xs text-error">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="imagen_url">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                URL de imagen
              </label>
              <input
                id={field.name}
                type="url"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="disponible">
          {(field) => (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              Disponible para la venta
            </label>
          )}
        </form.Field>

        {error && <p className="text-sm text-error">{error}</p>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </Modal>
  )
}
