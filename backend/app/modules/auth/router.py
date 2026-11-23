from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import get_current_active_user
from app.modules.auth.schemas import LoginResponse
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


@router.post("/register", response_model=UserPublic, status_code=201)
def register(data: UserCreate, service: AuthService = Depends(get_auth_service)) -> UserPublic:
    return service.register(data)


@router.post("/token", response_model=LoginResponse)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    token = service.login(form_data.username, form_data.password)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.access_token_expire_minutes * 60,
        samesite="lax",
    )
    return LoginResponse(message="Login exitoso")


@router.post("/logout", response_model=LoginResponse)
def logout(response: Response) -> LoginResponse:
    response.delete_cookie("access_token")
    return LoginResponse(message="Logout exitoso")


@router.get("/me", response_model=UserPublic)
def me(usuario: UserPublic = Depends(get_current_active_user)) -> UserPublic:
    return usuario
