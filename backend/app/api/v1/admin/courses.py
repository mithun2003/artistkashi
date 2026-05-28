from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.core.auth.users import current_active_user

router = APIRouter(prefix="/courses", tags=["admin-courses"])

@router.get("/")
async def list_courses(user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return [{"id": "c1", "title": "Intro"}]

@router.get("/{course_id}")
async def get_course(course_id: str, user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return {"id": course_id, "title": "Intro"}
