import { useForm } from '@tanstack/react-form'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
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

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
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
              <Input
                id={field.name}
                label="Direccion de entrega"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
              />
            )}
          </form.Field>

          <form.Field name="forma_pago">
            {(field) => (
              <Select
                id={field.name}
                label="Forma de pago"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as FormaPago)}
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </Select>
            )}
          </form.Field>

          <form.Field name="notas">
            {(field) => (
              <Textarea
                id={field.name}
                label="Notas (opcional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
              />
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
      </Card>
    </div>
  )
}
