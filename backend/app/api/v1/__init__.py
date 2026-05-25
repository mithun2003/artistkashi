from fastapi import APIRouter

from app.auth.users import AUTH_URL_PATH, auth_backend, fastapi_users
from .admin import router as admin_router
from .addresses import router as addresses_router
from .health import router as health_router
from .test import router as test_router
from .users import router as users_router
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix=f"/{AUTH_URL_PATH}/jwt",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

router.include_router(health_router)
router.include_router(test_router)
router.include_router(users_router)
router.include_router(addresses_router)
router.include_router(admin_router)
