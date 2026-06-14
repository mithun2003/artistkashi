from typing import Annotated

from fastapi import APIRouter, Query
from fastcrud import compute_offset

from app.api.dependencies import DatabaseDep
from app.core.exceptions import ErrorCode, NotFoundException
from app.core.pagination import build_paginated_response
from app.crud.course import crud_course
from app.schemas.course import CourseRead
from app.schemas.responses import PaginatedResponse, SuccessResponse

router = APIRouter(tags=["courses"])


@router.get("/courses", response_model=PaginatedResponse[CourseRead])
async def list_courses(
    db: DatabaseDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    courses_data = await crud_course.get_multi(
        db=db,
        offset=compute_offset(page, page_size),
        limit=page_size,
        return_total_count=True,
    )

    return build_paginated_response(
        result=courses_data,
        page=page,
        page_size=page_size,
        message="Courses retrieved successfully",
    )


@router.get("/courses/{course_id}", response_model=SuccessResponse[CourseRead])
async def get_course(course_id: int, db: DatabaseDep) -> SuccessResponse:
    course = await crud_course.get(db=db, id=course_id)
    if not course:
        raise NotFoundException(
            resource="Course",
            identifier=course_id,
            error_code=ErrorCode.COURSE_NOT_FOUND,
        )
    return SuccessResponse(message="Course retrieved successfully", data=course)
