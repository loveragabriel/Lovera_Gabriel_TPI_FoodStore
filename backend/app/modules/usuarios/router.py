from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


@router.get("", response_model=list[UserPublic], dependencies=[Depends(require_role(["admin"]))])
def listar_usuarios(service: UsuarioService = Depends(get_usuario_service)) -> list[UserPublic]:
    return service.listar()


@router.post(
    "/{usuario_id}/activar",
    response_model=UserPublic,
    dependencies=[Depends(require_role(["admin"]))],
)
def activar_usuario(usuario_id: int, service: UsuarioService = Depends(get_usuario_service)) -> UserPublic:
    return service.activar(usuario_id)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    usuario_id: int,
    service: UsuarioService = Depends(get_usuario_service),
    admin: UserPublic = Depends(require_role(["admin"])),
) -> UserPublic:
    return service.desactivar(usuario_id, admin.id)
