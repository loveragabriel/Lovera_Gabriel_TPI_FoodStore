import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Textarea } from '@/shared/ui/Textarea'

import type { Categoria, CategoriaInput } from '../types/categoria.types'

interface CategoriaFormModalProps {
  open: boolean
  categoria: Categoria | null
  onClose: () => void
  onSubmit: (data: CategoriaInput) => Promise<unknown>
}

export function CategoriaFormModal({ open, categoria, onClose, onSubmit }: CategoriaFormModalProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    } as CategoriaInput,
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
    <Modal open={open} title={categoria ? 'Editar categoria' : 'Nueva categoria'} onClose={onClose}>
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
            onBlur: ({ value }) =>
              value.trim().length < 2 || value.trim().length > 100
                ? 'El nombre debe tener entre 2 y 100 caracteres'
                : undefined,
          }}
        >
          {(field) => (
            <Input
              id={field.name}
              label="Nombre"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
            />
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <Textarea
              id={field.name}
              label="Descripcion"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
            />
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
