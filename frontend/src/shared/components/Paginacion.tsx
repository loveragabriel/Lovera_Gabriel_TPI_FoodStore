import { Button } from '@/shared/ui/Button'

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
}

export function Paginacion({ pagina, totalPaginas, onCambiarPagina }: PaginacionProps) {
  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" disabled={pagina <= 1} onClick={() => onCambiarPagina(pagina - 1)}>
        Anterior
      </Button>
      <span className="text-sm text-gray-600">
        Pagina {pagina} de {totalPaginas}
      </span>
      <Button variant="outline" disabled={pagina >= totalPaginas} onClick={() => onCambiarPagina(pagina + 1)}>
        Siguiente
      </Button>
    </div>
  )
}
