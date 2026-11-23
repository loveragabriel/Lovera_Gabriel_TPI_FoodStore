from datetime import datetime

from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic

TRANSICIONES: dict[str, set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class ProductoNoEncontrado(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, usuario_id: int, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            producto_ids = [item.producto_id for item in data.items]
            if len(producto_ids) != len(set(producto_ids)):
                raise ProductoRepetido()

            pedido = Pedido(
                usuario_id=usuario_id,
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0,
            )
            uow.pedidos.add(pedido)

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado()
                if not producto.disponible:
                    raise ProductoNoDisponible()
                if producto.stock < item.cantidad:
                    raise StockInsuficiente()

                producto.stock -= item.cantidad
                uow.productos.add(producto)

                subtotal = producto.precio_base * item.cantidad
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )
                uow.pedidos.add_detalle(detalle)
                total += subtotal

            pedido.total = total
            uow.pedidos.add(pedido)

            return PedidoRead.model_validate(pedido)

    def listar(
        self,
        usuario_actual: UserPublic,
        skip: int,
        limit: int,
        estado: str | None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            usuario_id = None if usuario_actual.role == "admin" else usuario_actual.id
            pedidos = uow.pedidos.list_by_usuario(usuario_id=usuario_id, estado=estado, skip=skip, limit=limit)
            total = uow.pedidos.count(usuario_id=usuario_id, estado=estado)
            return PedidosPaginados(
                total=total,
                items=[PedidoRead.model_validate(pedido) for pedido in pedidos],
            )

    def obtener(self, pedido_id: int, usuario_actual: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if usuario_actual.role != "admin" and pedido.usuario_id != usuario_actual.id:
                raise PedidoAjeno()
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if nuevo_estado not in TRANSICIONES.get(pedido.estado, set()):
                raise TransicionInvalida()

            if nuevo_estado == "CANCELADO":
                self._restituir_stock(uow, pedido)

            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.utcnow()
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario_actual: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if pedido.usuario_id != usuario_actual.id:
                raise PedidoAjeno()
            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida()

            self._restituir_stock(uow, pedido)
            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.utcnow()
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def _restituir_stock(self, uow: PedidoUnitOfWork, pedido: Pedido) -> None:
        for detalle in pedido.items:
            producto = uow.productos.get_by_id(detalle.producto_id)
            if producto is not None:
                producto.stock += detalle.cantidad
                uow.productos.add(producto)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado("PENDIENTE"),
                en_preparacion=uow.pedidos.count_by_estado("EN_PREPARACION"),
                entregados=uow.pedidos.count_by_estado("ENTREGADO"),
                cancelados=uow.pedidos.count_by_estado("CANCELADO"),
                pedidos_hoy=uow.pedidos.count_hoy(),
                ingresos_entregados=uow.pedidos.suma_total_por_estado("ENTREGADO"),
            )
