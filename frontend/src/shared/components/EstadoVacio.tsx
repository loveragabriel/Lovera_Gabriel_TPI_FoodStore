interface EstadoVacioProps {
  mensaje: string
}

export function EstadoVacio({ mensaje }: EstadoVacioProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      <p>{mensaje}</p>
    </div>
  )
}
