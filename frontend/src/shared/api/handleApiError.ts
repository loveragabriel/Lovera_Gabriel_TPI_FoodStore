import axios from 'axios'

export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Error inesperado.'
  if (error.code === 'ECONNABORTED') return 'El servidor tardo demasiado en responder.'
  if (!error.response) return 'No se pudo conectar con el servidor.'

  const { status, data } = error.response
  const detail = (data as { detail?: unknown } | undefined)?.detail

  switch (status) {
    case 401:
      return 'La sesion vencio. Inicia sesion de nuevo.'
    case 403:
      return 'No tenes permisos para realizar esta accion.'
    case 422:
      return 'Los datos enviados no son validos.'
  }

  if (typeof detail === 'string') return detail
  if (status < 500) return 'No se pudo completar la operacion.'
  return 'Error del servidor. Intenta nuevamente mas tarde.'
}
