import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import type { Producto, StockInput } from '../types/producto.types'

interface StockModalProps {
  open: boolean
  producto: Producto | null
  onClose: () => void
  onSubmit: (data: StockInput) => Promise<unknown>
}

export function StockModal({ open, producto, onClose, onSubmit }: StockModalProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
    } as StockInput,
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
    <Modal open={open} title={`Stock de ${producto?.nombre ?? ''}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4"
      >
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
