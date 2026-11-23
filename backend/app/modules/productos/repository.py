from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def _filtered_statement(
        self,
        nombre: str | None,
        categoria_id: int | None,
        disponible: bool | None,
    ):
        statement = select(Producto).where(Producto.activo == True)
        if nombre:
            statement = statement.where(Producto.nombre.ilike(f"%{nombre}%"))
        if categoria_id is not None:
            statement = statement.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            statement = statement.where(Producto.disponible == disponible)
        return statement

    def search(
        self,
        nombre: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Producto]:
        statement = self._filtered_statement(nombre, categoria_id, disponible)
        statement = statement.offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def count(
        self,
        nombre: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> int:
        statement = self._filtered_statement(nombre, categoria_id, disponible)
        return len(self.session.exec(statement).all())
