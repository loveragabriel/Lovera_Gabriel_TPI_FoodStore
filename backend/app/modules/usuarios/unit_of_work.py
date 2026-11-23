from app.core.database import session_factory as default_session_factory
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.repository import UsuarioRepository


class UsuarioUnitOfWork(UnitOfWork):
    def __init__(self, session_factory=default_session_factory) -> None:
        super().__init__(session_factory)

    def __enter__(self) -> "UsuarioUnitOfWork":
        super().__enter__()
        self.usuarios = UsuarioRepository(self.session)
        return self
