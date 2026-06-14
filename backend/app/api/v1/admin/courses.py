from fastapi import APIRouter

from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/courses", tags=["admin-courses"])


@router.get("", response_model=SuccessResponse[list[dict[str, str]]])
async def list_courses():
    return SuccessResponse(
        message="Courses retrieved successfully", data=[{"id": "c1", "title": "Intro"}]
    )


@router.get("/{course_id}", response_model=SuccessResponse[dict[str, str]])
async def get_course(course_id: str):
    return SuccessResponse(
        message="Course retrieved successfully",
        data={"id": course_id, "title": "Intro"},
    )
