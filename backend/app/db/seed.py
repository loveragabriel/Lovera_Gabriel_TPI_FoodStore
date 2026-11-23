from app.core.database import create_all_tables
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.productos.models import Producto
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


def seed_admin() -> None:
    with UsuarioUnitOfWork() as uow:
        if uow.usuarios.get_by_username("admin") is not None:
            return
        uow.usuarios.add(
            Usuario(
                username="admin",
                full_name="Gabriel Lovera",
                email="admin@foodstore.com",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
            )
        )


def seed_categorias() -> dict[str, int]:
    nombres = ["Pizzas", "Hamburguesas", "Bebidas"]
    with CategoriaUnitOfWork() as uow:
        for nombre in nombres:
            if uow.categorias.get_by_nombre(nombre) is None:
                uow.categorias.add(Categoria(nombre=nombre))

    with CategoriaUnitOfWork() as uow:
        return {categoria.nombre: categoria.id for categoria in uow.categorias.get_all()}


def seed_productos(categoria_ids: dict[str, int]) -> None:
    productos = [
        ("Pizza Muzzarella", "Pizzas", 8500.0, 20, "pizza-muzzarella.jpg"),
        ("Pizza Napolitana", "Pizzas", 9200.0, 15, "pizza-napolitana.jpg"),
        ("Pizza Fugazzeta", "Pizzas", 9500.0, 10, "pizza-fugazzeta.jpg"),
        ("Hamburguesa Clasica", "Hamburguesas", 6500.0, 25, "hamburguesa-clasica.jpg"),
        ("Hamburguesa Doble Cheddar", "Hamburguesas", 7800.0, 18, "hamburguesa-doble-cheddar.jpg"),
        ("Hamburguesa Veggie", "Hamburguesas", 7200.0, 12, "hamburguesa-veggie.jpg"),
        ("Gaseosa 500ml", "Bebidas", 1500.0, 50, "gaseosa-500ml.jpg"),
        ("Agua Mineral 500ml", "Bebidas", 1000.0, 50, "agua-mineral-500ml.jpg"),
    ]
    with ProductoUnitOfWork() as uow:
        existentes = {producto.nombre for producto in uow.productos.get_all()}
        for nombre, categoria_nombre, precio, stock, imagen in productos:
            if nombre in existentes:
                continue
            uow.productos.add(
                Producto(
                    nombre=nombre,
                    categoria_id=categoria_ids[categoria_nombre],
                    precio_base=precio,
                    stock=stock,
                    imagen_url=f"/images/productos/{imagen}",
                )
            )


def run() -> None:
    create_all_tables()
    seed_admin()
    categoria_ids = seed_categorias()
    seed_productos(categoria_ids)


if __name__ == "__main__":
    run()
