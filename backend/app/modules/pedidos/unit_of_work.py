from app.core.database import session_factory as default_session_factory
from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    def __init__(self, session_factory=default_session_factory) -> None:
        super().__init__(session_factory)

    def __enter__(self) -> "PedidoUnitOfWork":
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
