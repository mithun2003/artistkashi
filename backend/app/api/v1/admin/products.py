from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.auth.users import current_active_user

router = APIRouter(prefix="/products", tags=["admin-products"])

@router.get("/")
async def list_products(user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return [{"id": "p1", "name": "Sample Product"}]

@router.get("/{product_id}")
async def get_product(product_id: str, user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return {"id": product_id, "name": "Sample Product"}
