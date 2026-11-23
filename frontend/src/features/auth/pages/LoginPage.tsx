import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/shared/ui/Button'
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <form.Field name="username">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Contrasena
              </label>
              <input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand"
              />
            </div>
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

      <p className="text-center text-sm text-gray-600">
        No tenes cuenta?{' '}
        <Link to="/register" className="text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}
