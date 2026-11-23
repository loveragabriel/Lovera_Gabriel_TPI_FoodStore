from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import CambioEstado, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    data: PedidoCreate,
    usuario: UserPublic = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoRead:
    try:
        return service.crear(usuario.id, data)
    except ProductoNoEncontrado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto inexistente o inactivo")
    except ProductoNoDisponible:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Producto no disponible")
    except StockInsuficiente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stock insuficiente")
    except ProductoRepetido:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Producto repetido en el pedido")


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: str | None = None,
    usuario: UserPublic = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
) -> PedidosPaginados:
    return service.listar(usuario, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos, dependencies=[Depends(require_role(["admin"]))])
def resumen_pedidos(service: PedidoService = Depends(get_pedido_service)) -> ResumenPedidos:
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: UserPublic = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoRead:
    try:
        return service.obtener(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario")


@router.patch(
    "/{pedido_id}/estado",
    response_model=PedidoRead,
    dependencies=[Depends(require_role(["admin"]))],
)
def cambiar_estado_pedido(
    pedido_id: int,
    data: CambioEstado,
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoRead:
    try:
        return service.cambiar_estado(pedido_id, data.estado)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    except TransicionInvalida:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Transicion de estado invalida")


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    pedido_id: int,
    usuario: UserPublic = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoRead:
    try:
        return service.cancelar(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario")
    except TransicionInvalida:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El pedido no esta en PENDIENTE")
