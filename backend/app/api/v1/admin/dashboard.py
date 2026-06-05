from fastapi import APIRouter, HTTPException

from app.api.dependencies import CurrentUserDep

router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])


@router.get("/overview")
async def overview(user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return {"users": 42, "courses": 7, "products": 13}
