import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { useAuthStore } from '@/store/authStore'

interface LoginFormValues {
  username: string
  password: string
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const form = useForm({
    defaultValues: { username: '', password: '' } as LoginFormValues,
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await login(value.username, value.password)
        navigate(from, { replace: true })
      } catch (e) {
        const detail =
          (e as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? 'No se pudo iniciar sesion'
        setError(detail)
      }
    },
  })

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ingresar</h1>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="username">
            {(field) => (
              <Input
                id={field.name}
                label="Usuario"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Input
                id={field.name}
                label="Contrasena"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          {error && <p className="text-sm text-error">{error}</p>}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Card>

      <p className="text-center text-sm text-gray-600">
        No tenes cuenta?{' '}
        <Link to="/register" className="text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}
