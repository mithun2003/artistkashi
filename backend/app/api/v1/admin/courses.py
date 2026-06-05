from fastapi import APIRouter, HTTPException

from app.api.dependencies import CurrentUserDep

router = APIRouter(prefix="/courses", tags=["admin-courses"])

@router.get("/")
async def list_courses(user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return [{"id": "c1", "title": "Intro"}]

@router.get("/{course_id}")
async def get_course(course_id: str, user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return {"id": course_id, "title": "Intro"}
