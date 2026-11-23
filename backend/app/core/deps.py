from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> str | None:
        token = request.cookies.get("access_token")
        if not token:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="No autenticado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return None
        return token


oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/api/v1/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales invalidas o token expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username = payload.get("sub")
    if username is None:
        raise credentials_exception

    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_username(username)
        if usuario is None:
            raise credentials_exception
        return UserPublic.model_validate(usuario)


def get_current_active_user(usuario: UserPublic = Depends(get_current_user)) -> UserPublic:
    if usuario.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
    return usuario


def require_role(roles: list[str]):
    def checker(usuario: UserPublic = Depends(get_current_active_user)) -> UserPublic:
        if usuario.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tiene permisos suficientes")
        return usuario

    return checker
