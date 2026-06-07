from fastapi import APIRouter

from app.core.auth.users import AUTH_URL_PATH, auth_backend, fastapi_users
from app.core.config import settings
from app.schemas.user import UserCreate, UserRead, UserUpdate

from .addresses import router as addresses_router
from .admin import router as admin_router
from .cart import router as cart_router
from .courses import router as courses_router
from .health import router as health_router
from .products import router as products_router
from .reviews import router as reviews_router
from .users import router as users_router
from .wishlist import router as wishlist_router

router = APIRouter(prefix=settings.API_V1_PREFIX)

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
router.include_router(users_router)
router.include_router(addresses_router)
router.include_router(reviews_router)
router.include_router(admin_router)
router.include_router(courses_router)
router.include_router(products_router)
router.include_router(cart_router)
router.include_router(wishlist_router)
