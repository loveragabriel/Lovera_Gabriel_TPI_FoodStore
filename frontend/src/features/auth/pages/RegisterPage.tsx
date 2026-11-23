import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '@/features/auth/api/auth'
import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'

interface RegisterFormValues {
  username: string
  full_name: string
  email: string
  password: string
}

const defaultValues: RegisterFormValues = {
  username: '',
  full_name: '',
  email: '',
  password: '',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await register(value)
        navigate('/login')
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <form.Field
          name="username"
          validators={{
            onBlur: ({ value }) => (value.trim().length < 3 ? 'Minimo 3 caracteres' : undefined),
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Usuario
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

        <form.Field name="full_name">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Nombre completo
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

        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => (!value.includes('@') ? 'Email invalido' : undefined),
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id={field.name}
                type="email"
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

        <form.Field
          name="password"
          validators={{
            onBlur: ({ value }) => (value.length < 8 ? 'Minimo 8 caracteres' : undefined),
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Contrasena
              </label>
              <input
                id={field.name}
                type="password"
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

        {error && <p className="text-sm text-error">{error}</p>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="text-center text-sm text-gray-600">
        Ya tenes cuenta?{' '}
        <Link to="/login" className="text-brand hover:underline">
          Ingresa
        </Link>
      </p>
    </div>
  )
}
