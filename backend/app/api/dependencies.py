"""Centralized API dependencies."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.auth.users import current_active_user
from app.models.user import User

# Database dependency
DatabaseDep = Annotated[AsyncSession, Depends(get_db)]

# Current user dependency
CurrentUserDep = Annotated[User, Depends(current_active_user)]

# Optional current user (for endpoints that allow both authenticated and anonymous users)
OptionalCurrentUserDep = Annotated[User | None, Depends(current_active_user)]
