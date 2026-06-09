import pytest
from sqlalchemy import select

from app.core.auth.security import (
    hash_password,
    verify_password,
)
from app.models import User
from commands.create_admin import upsert_admin_user


@pytest.mark.asyncio(loop_scope="function")
async def test_create_admin_user(db_session):
    status, user = await upsert_admin_user(
        db_session,
        email="admin@example.com",
        password="StrongPass1!",
        full_name="Admin User",
    )

    stored = await db_session.execute(
        select(User).where(User.email == "admin@example.com")
    )
    persisted = stored.scalar_one()

    assert status == "created"
    assert user.email == "admin@example.com"
    assert user.is_superuser is True
    assert user.is_active is True
    assert user.is_verified is True
    assert persisted.full_name == "Admin User"
    assert verify_password(
        "StrongPass1!",
        persisted.hashed_password,
    )


@pytest.mark.asyncio(loop_scope="function")
async def test_promote_existing_user_without_resetting_password(db_session):
    original_hash = hash_password("UserPass1!")
    user = User(
        email="existing@example.com",
        hashed_password=original_hash,
        is_active=False,
        is_superuser=False,
        is_verified=False,
        full_name="Existing User",
    )
    db_session.add(user)
    await db_session.commit()

    status, updated = await upsert_admin_user(
        db_session,
        email="existing@example.com",
        full_name="Existing User",
    )

    assert status == "updated"
    assert updated.is_superuser is True
    assert updated.is_active is True
    assert updated.is_verified is True
    assert updated.hashed_password == original_hash
