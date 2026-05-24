from fastapi import APIRouter, Depends
from app.auth.users import current_active_user
from typing import Any

router = APIRouter(tags=["users"])


@router.get("/profiles/me")
async def read_own_profile(user: Any = Depends(current_active_user)):
    """Example: returns the currently authenticated user's public profile.

    Note: user is the model object provided by fastapi-users. For auth-managed
    user creation/password flows use the /auth and /users endpoints already
    registered by fastapi-users (see app.main).
    """
    return {"id": str(user.id), "email": user.email, "is_active": user.is_active}


@router.get("/profiles")
async def list_profiles(q: str | None = None):
    """Search-like example for public profiles (dummy implementation)."""
    results = [{"id": "1", "email": "alice@example.com"}]
    if q:
        results = [r for r in results if q in r["email"]]
    return results
