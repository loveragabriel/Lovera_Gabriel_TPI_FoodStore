from app.core.database import session_factory as default_session_factory
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository


class CategoriaUnitOfWork(UnitOfWork):
    def __init__(self, session_factory=default_session_factory) -> None:
        super().__init__(session_factory)

    def __enter__(self) -> "CategoriaUnitOfWork":
        super().__enter__()
        self.categorias = CategoriaRepository(self.session)
        return self
