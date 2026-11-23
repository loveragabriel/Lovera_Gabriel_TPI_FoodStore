import { useForm } from '@tanstack/react-form'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { useCartStore } from '@/store/cartStore'

import { useCrearPedido } from '../hooks/useCrearPedido'
import type { FormaPago } from '../types/pedido.types'

interface CheckoutFormValues {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string
}

const defaultValues: CheckoutFormValues = {
  direccion_entrega: '',
  forma_pago: 'EFECTIVO',
  notas: '',
}

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const navigate = useNavigate()
  const crearPedido = useCrearPedido()
  const pedidoConfirmado = useRef(false)

  useEffect(() => {
    if (items.length === 0 && !pedidoConfirmado.current) {
      navigate('/carrito', { replace: true })
    }
  }, [items.length, navigate])

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await crearPedido.mutateAsync({
        items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
        forma_pago: value.forma_pago,
        direccion_entrega: value.direccion_entrega,
        notas: value.notas || undefined,
      })
      pedidoConfirmado.current = true
      vaciar()
      navigate('/mis-pedidos', { replace: true })
    },
  })

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Confirmar pedido</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <form.Field
          name="direccion_entrega"
          validators={{
            onBlur: ({ value }) =>
              value.trim().length < 5 || value.trim().length > 200
                ? 'La direccion debe tener entre 5 y 200 caracteres'
                : undefined,
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Direccion de entrega
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

        <form.Field name="forma_pago">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Forma de pago
              </label>
              <select
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as FormaPago)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="notas">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Notas (opcional)
              </label>
              <textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-brand">${total.toLocaleString('es-AR')}</span>
        </div>

        {crearPedido.isError && <p className="text-sm text-error">{handleApiError(crearPedido.error)}</p>}

        <Button type="submit" disabled={crearPedido.isPending}>
          {crearPedido.isPending ? 'Confirmando...' : 'Confirmar pedido'}
        </Button>
      </form>
    </div>
  )
}
