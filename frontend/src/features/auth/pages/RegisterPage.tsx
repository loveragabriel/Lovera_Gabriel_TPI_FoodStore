import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '@/features/auth/api/auth'
import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { useAuthStore } from '@/store/authStore'

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
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await register(value)
        await login(value.username, value.password)
        navigate('/', { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field
            name="username"
            validators={{
              onBlur: ({ value }) => (value.trim().length < 3 ? 'Minimo 3 caracteres' : undefined),
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Usuario"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
              />
            )}
          </form.Field>

          <form.Field name="full_name">
            {(field) => (
              <Input
                id={field.name}
                label="Nombre completo"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) => (!value.includes('@') ? 'Email invalido' : undefined),
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Email"
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => (value.length < 8 ? 'Minimo 8 caracteres' : undefined),
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Contrasena"
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
              />
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
      </Card>

      <p className="text-center text-sm text-gray-600">
        Ya tenes cuenta?{' '}
        <Link to="/login" className="text-brand hover:underline">
          Ingresa
        </Link>
      </p>
    </div>
  )
}
