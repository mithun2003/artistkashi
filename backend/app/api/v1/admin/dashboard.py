from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.auth.users import current_active_user

router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])

@router.get("/overview")
async def overview(user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return {"users": 42, "courses": 7, "products": 13}
