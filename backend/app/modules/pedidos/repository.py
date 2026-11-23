from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Pedido]:
        statement = select(Pedido)
        if usuario_id is not None:
            statement = statement.where(Pedido.usuario_id == usuario_id)
        if estado:
            statement = statement.where(Pedido.estado == estado)
        statement = statement.offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def count_by_estado(self, estado: str) -> int:
        statement = select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        return self.session.exec(statement).one()
