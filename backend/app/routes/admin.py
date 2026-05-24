from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.auth.users import current_active_user

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def admin_stats(user: Any = Depends(current_active_user)):
    """Simple admin-only endpoint. Check the user model for admin flag.

    fastapi-users' default SQLAlchemy user table includes is_superuser/is_active
    fields; adapt this check to your custom user model if different.
    """
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Return a mocked stats payload
    return {"users": 42, "courses": 7, "products": 13}
