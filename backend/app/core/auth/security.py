from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID, uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# =====================================================
# Password Hashing
# =====================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """Hash a plain password."""
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Verify a plain password against a hash."""
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# =====================================================
# Token Constants
# =====================================================

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"
VERIFY_EMAIL_TOKEN_TYPE = "verify_email"
PASSWORD_RESET_TOKEN_TYPE = "password_reset"

TOKEN_AUDIENCE = "artistkashi"


# =====================================================
# Internal JWT Builder
# =====================================================


def _create_token(
    *,
    user_id: UUID,
    token_type: str,
    secret: str,
    expires_delta: timedelta,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """
    Create a JWT token.
    """

    now = datetime.now(UTC)

    payload: dict[str, Any] = {
        "sub": str(user_id),
        "type": token_type,
        "aud": TOKEN_AUDIENCE,
        "jti": str(uuid4()),
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }

    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(
        payload,
        secret,
        algorithm=settings.ALGORITHM,
    )


def _decode_token(
    *,
    token: str,
    secret: str,
    expected_type: str,
) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token,
            secret,
            audience=TOKEN_AUDIENCE,
            algorithms=[settings.ALGORITHM],
        )

        if payload.get("type") != expected_type:
            return None

        return payload

    except JWTError:
        return None


# =====================================================
# Access Token
# =====================================================


def create_access_token(
    *,
    user_id: UUID,
) -> str:
    """
    Create short-lived access token.
    """

    return _create_token(
        user_id=user_id,
        token_type=ACCESS_TOKEN_TYPE,
        secret=settings.ACCESS_SECRET_KEY,
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        ),
    )


# =====================================================
# Refresh Token
# =====================================================


def create_refresh_token(
    *,
    user_id: UUID,
) -> str:
    """
    Create long-lived refresh token.
    """

    return _create_token(
        user_id=user_id,
        token_type=REFRESH_TOKEN_TYPE,
        secret=settings.REFRESH_SECRET_KEY,
        expires_delta=timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS,
        ),
    )


# =====================================================
# Decode Access Token
# =====================================================


def decode_access_token(
    token: str,
) -> dict[str, Any] | None:
    return _decode_token(
        token=token,
        secret=settings.ACCESS_SECRET_KEY,
        expected_type=ACCESS_TOKEN_TYPE,
    )


# =====================================================
# Decode Refresh Token
# =====================================================


def decode_refresh_token(
    token: str,
) -> dict[str, Any] | None:
    """
    Decode and validate refresh token.
    """

    try:
        payload = jwt.decode(
            token,
            settings.REFRESH_SECRET_KEY,
            audience=TOKEN_AUDIENCE,
            algorithms=[settings.ALGORITHM],
        )

        if is_refresh_token(payload) is False:
            return None

        return payload

    except JWTError:
        return None


# =====================================================
# Helpers
# =====================================================


def get_user_id_from_token(
    payload: dict[str, Any],
) -> UUID:
    """
    Extract user UUID from token payload.
    """

    return UUID(payload["sub"])


def get_token_jti(
    payload: dict[str, Any],
) -> str:
    """
    Extract token JTI.
    """

    return str(payload["jti"])


def get_token_expiry(
    payload: dict[str, Any],
) -> datetime:
    """
    Convert exp claim into datetime.
    """

    return datetime.fromtimestamp(
        payload["exp"],
        tz=UTC,
    )


def is_access_token(
    payload: dict[str, Any],
) -> bool:
    """
    Check if payload belongs to an access token.
    """

    return payload.get("type") == ACCESS_TOKEN_TYPE


def is_refresh_token(
    payload: dict[str, Any],
) -> bool:
    """
    Check if payload belongs to a refresh token.
    """

    return payload.get("type") == REFRESH_TOKEN_TYPE


def create_email_verification_token(
    *,
    user_id: UUID,
) -> str:
    return _create_token(
        user_id=user_id,
        token_type=VERIFY_EMAIL_TOKEN_TYPE,
        secret=settings.VERIFICATION_SECRET_KEY,
        expires_delta=timedelta(hours=24),
    )


def decode_verification_token(
    token: str,
) -> dict[str, Any] | None:
    return _decode_token(
        token=token,
        secret=settings.VERIFICATION_SECRET_KEY,
        expected_type=VERIFY_EMAIL_TOKEN_TYPE,
    )


def create_password_reset_token(
    *,
    user_id: UUID,
) -> str:
    return _create_token(
        user_id=user_id,
        token_type=PASSWORD_RESET_TOKEN_TYPE,
        secret=settings.RESET_PASSWORD_SECRET_KEY,
        expires_delta=timedelta(minutes=15),
    )


def decode_password_reset_token(
    token: str,
) -> dict[str, Any] | None:
    return _decode_token(
        token=token,
        secret=settings.RESET_PASSWORD_SECRET_KEY,
        expected_type=PASSWORD_RESET_TOKEN_TYPE,
    )
