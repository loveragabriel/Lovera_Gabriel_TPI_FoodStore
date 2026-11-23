import { Button } from '@/shared/ui/Button'

interface EstadoErrorProps {
  mensaje?: string
  onRetry?: () => void
}

export function EstadoError({ mensaje = 'No se pudieron cargar los datos.', onRetry }: EstadoErrorProps) {
  return (
    <div role="alert" className="space-y-3 rounded-lg border border-error p-4 text-center text-error">
      <p>{mensaje}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
