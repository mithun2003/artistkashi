#!/usr/bin/env python3
"""
Seed initial reviews for the community section.

Usage:
    uv run python -m commands.seed_reviews
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from uuid import UUID

from sqlalchemy import select

from app.crud.review import crud_review
from app.core.db import async_session
from app.lib.constants import DEFAULT_REVIEWS
from app.models.review import Review, ReviewStatus
from app.models.user import User
from app.schemas.review import ReviewCreate


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Seed initial reviews.")
    parser.add_argument(
        "--user-id",
        type=str,
        help="User ID to assign as the review creator (uses first admin by default).",
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear all existing reviews before seeding.",
    )
    parser.add_argument(
        "--approve-all",
        action="store_true",
        help="Automatically approve all seeded reviews.",
    )
    return parser


async def get_or_create_reviewer() -> UUID:
    """Get first admin user or create a default one if needed."""
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.is_superuser == True).limit(1)
        )
        admin = result.scalar_one_or_none()
        if admin:
            return admin.id

    raise ValueError(
        "No admin user found. Please create an admin user first using create_admin.py"
    )


async def clear_reviews() -> int:
    """Delete all existing reviews."""
    async with async_session() as session:
        # Use crud_review for consistency if we want, but simple delete is fine
        from sqlalchemy import delete
        await session.execute(delete(Review))
        await session.commit()
    return 0


async def seed_reviews(
    user_id: str | None = None,
    approve_all: bool = False,
    clear: bool = False,
) -> int:
    """Seed initial reviews."""
    if clear:
        await clear_reviews()
        print("Cleared all reviews")

    if not user_id:
        user_id_str = str(await get_or_create_reviewer())
    else:
        user_id_str = user_id

    async with async_session() as session:
        count = 0
        for review_data in DEFAULT_REVIEWS:
            status = ReviewStatus.approved if approve_all else ReviewStatus.pending
            
            await crud_review.create(
                db=session,
                object={
                    **review_data,
                    "user_id": UUID(user_id_str),
                    "status": status
                }
            )

            count += 1
            status_str = "approved" if approve_all else "pending"
            print(f"✓ Seeded review: {review_data['type']} - {status_str}")

    print(f"\nSuccessfully seeded {count} reviews")
    return 0


async def run() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        return await seed_reviews(
            user_id=args.user_id,
            approve_all=args.approve_all,
            clear=args.clear,
        )
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1


def main() -> int:
    try:
        return asyncio.run(run())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
