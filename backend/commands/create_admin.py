#!/usr/bin/env python3
"""
Create or promote an admin user.

Usage:
    ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='StrongPass1!' \
    uv run python -m commands.create_admin
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.password_policy import validate_password_rules
from app.core.auth.security import hash_password
from app.core.db import async_session
from app.models.user import Role, User


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Create or promote a superuser.")
    parser.add_argument("--email", default=os.getenv("ADMIN_EMAIL"))
    parser.add_argument("--password", default=os.getenv("ADMIN_PASSWORD"))
    parser.add_argument("--full-name", default=os.getenv("ADMIN_FULL_NAME"))
    parser.add_argument(
        "--update-password",
        action="store_true",
        default=os.getenv("ADMIN_UPDATE_PASSWORD", "false").lower() == "true",
        help="Replace the password for an existing user.",
    )
    return parser


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


async def upsert_admin_user(
    session: AsyncSession,
    *,
    email: str,
    password: str | None = None,
    full_name: str | None = None,
    update_password: bool = False,
) -> tuple[str, User]:
    cleaned_email = email.strip()
    normalized_email = cleaned_email.lower()
    normalized_full_name = _clean_optional(full_name)

    result = await session.execute(select(User).where(User.email == normalized_email))
    user = result.scalar_one_or_none()

    if user is None:
        if not password:
            raise ValueError("ADMIN_PASSWORD is required when creating a new admin.")

        errors = validate_password_rules(cleaned_email, password)
        if errors:
            raise ValueError("; ".join(errors))

        password_hash = hash_password(password)
        user = User(
            email=normalized_email,
            hashed_password=password_hash,
            is_active=True,
            is_superuser=True,
            is_verified=True,
            full_name=normalized_full_name,
            role=Role.ADMIN,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return "created", user

    changed = False

    if not user.is_superuser:
        user.is_superuser = True
        changed = True

    if not user.is_active:
        user.is_active = True
        changed = True

    if not user.is_verified:
        user.is_verified = True
        changed = True

    if user.role != Role.ADMIN:
        user.role = Role.ADMIN
        changed = True

    if normalized_full_name is not None and user.full_name != normalized_full_name:
        user.full_name = normalized_full_name
        changed = True

    if update_password:
        if not password:
            raise ValueError(
                "ADMIN_PASSWORD is required when --update-password is set."
            )

        errors = validate_password_rules(cleaned_email, password)
        if errors:
            raise ValueError("; ".join(errors))

        password_hash = hash_password(password)
        if user.hashed_password != password_hash:
            user.hashed_password = password_hash
            changed = True

    if changed:
        await session.commit()
        await session.refresh(user)
        return "updated", user

    return "unchanged", user


async def run() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if not args.email:
        raise ValueError("ADMIN_EMAIL is required.")

    async with async_session() as session:
        status, user = await upsert_admin_user(
            session,
            email=args.email,
            password=args.password,
            full_name=args.full_name,
            update_password=args.update_password,
        )

    print(f"{status}: {user.email} (id={user.id})")
    return 0


def main() -> int:
    try:
        return asyncio.run(run())
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
