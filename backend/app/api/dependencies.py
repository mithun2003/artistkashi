"""Centralized API dependencies."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.users import current_active_user
from app.core.db import get_db
from app.models.user import User

# Database dependency
type DatabaseDep = Annotated[AsyncSession, Depends(get_db)]

# Current user dependency
type CurrentUserDep = Annotated[User, Depends(current_active_user)]

# Optional current user (for endpoints that allow both authenticated
# and anonymous users)
type OptionalCurrentUserDep = Annotated[User | None, Depends(current_active_user)]
