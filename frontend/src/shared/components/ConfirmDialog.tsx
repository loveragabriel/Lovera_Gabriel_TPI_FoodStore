import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

interface ConfirmDialogProps {
  open: boolean
  mensaje: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, mensaje, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title="Confirmar" onClose={onCancel}>
      <p className="text-sm text-gray-700">{mensaje}</p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  )
}
