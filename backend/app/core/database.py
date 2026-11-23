from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(settings.database_url, echo=False)


def create_all_tables() -> None:
    from app.modules.categorias.models import Categoria
    from app.modules.pedidos.models import DetallePedido, Pedido
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario

    _ = (Categoria, Producto, Usuario, Pedido, DetallePedido)
    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    return Session(engine)
