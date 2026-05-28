#!/usr/bin/env python3
"""
Create or seed the homepage configuration.

Usage:
    uv run python -m commands.create_home_page
"""

from __future__ import annotations

import argparse
import asyncio
import sys

from sqlalchemy import select

from app.crud.site_config import update_config
from app.core.db import async_session
from app.lib.constants import DEFAULT_HOME_PAGE_CONFIG
from app.models.site_config import SiteConfig


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Seed the home page configuration.")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace the existing homepage config row if it already exists.",
    )
    return parser


async def seed_home_page(overwrite: bool = False) -> tuple[str, SiteConfig]:
    async with async_session() as session:
        result = await session.execute(select(SiteConfig).where(SiteConfig.key == "home_page"))
        existing = result.scalar_one_or_none()
        if existing is not None and not overwrite:
            return "unchanged", existing

        config = await update_config(
            session,
            key="home_page",
            value=DEFAULT_HOME_PAGE_CONFIG.model_dump(),
            description="Main landing page configuration",
        )
        return "seeded" if existing is None else "updated", config


async def run() -> int:
    parser = build_parser()
    args = parser.parse_args()
    status, config = await seed_home_page(overwrite=args.overwrite)
    print(f"{status}: {config.key}")
    return 0


def main() -> int:
    try:
        return asyncio.run(run())
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
