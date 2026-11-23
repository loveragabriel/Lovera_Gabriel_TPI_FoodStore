from datetime import datetime, time

from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def _filtered_statement(self, usuario_id: int | None, estado: str | None):
        statement = select(Pedido)
        if usuario_id is not None:
            statement = statement.where(Pedido.usuario_id == usuario_id)
        if estado:
            statement = statement.where(Pedido.estado == estado)
        return statement

    def list_by_usuario(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Pedido]:
        statement = self._filtered_statement(usuario_id, estado)
        statement = statement.offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def count(self, usuario_id: int | None = None, estado: str | None = None) -> int:
        statement = self._filtered_statement(usuario_id, estado)
        return len(self.session.exec(statement).all())

    def count_by_estado(self, estado: str) -> int:
        statement = select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        return self.session.exec(statement).one()

    def count_hoy(self) -> int:
        inicio_de_hoy = datetime.combine(datetime.utcnow().date(), time.min)
        statement = select(func.count()).select_from(Pedido).where(Pedido.created_at >= inicio_de_hoy)
        return self.session.exec(statement).one()

    def suma_total_por_estado(self, estado: str) -> float:
        statement = (
            select(func.coalesce(func.sum(Pedido.total), 0)).select_from(Pedido).where(Pedido.estado == estado)
        )
        return self.session.exec(statement).one()

    def add_detalle(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        return detalle
