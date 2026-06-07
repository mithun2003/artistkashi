import logging
import uuid

from fastapi import Depends, Request
from fastapi_users import (
    BaseUserManager,
    FastAPIUsers,
    InvalidPasswordException,
    UUIDIDMixin,
)
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase

from app.core.auth.password_policy import validate_password_rules
from app.core.config import settings
from app.core.db import get_user_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.email.email import send_reset_password_email

get_user_db_dep = Depends(get_user_db)
logger = logging.getLogger(__name__)

AUTH_URL_PATH = "auth"


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.RESET_PASSWORD_SECRET_KEY
    verification_token_secret = settings.VERIFICATION_SECRET_KEY

    async def on_after_register(self, user: User, request: Request | None = None):
        logger.info(f"✅ User registered: {user.email} (ID: {user.id})")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Request | None = None
    ):
        logger.info(f"🔐 Password reset requested for: {user.email}")
        await send_reset_password_email(user, token)

    async def on_after_request_verify(
        self, user: User, token: str, request: Request | None = None
    ):
        logger.info(f"📧 Email verification requested for: {user.email}")

    async def validate_password(
        self,
        password: str,
        user: UserCreate,
    ) -> None:
        errors = validate_password_rules(user.email, password)

        if errors:
            logger.warning(f"❌ Password validation failed for {user.email}: {errors}")
            raise InvalidPasswordException(reason=errors)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = get_user_db_dep):
    yield UserManager(user_db)


bearer_transport = BearerTransport(tokenUrl=f"{AUTH_URL_PATH}/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.ACCESS_SECRET_KEY,
        lifetime_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)

logger.info("✅ Authentication system initialized")
