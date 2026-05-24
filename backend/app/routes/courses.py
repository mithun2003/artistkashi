from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["courses"])


class Course(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None


_courses: dict[int, Course] = {}
_next_course_id = 1


@router.get("/courses", response_model=List[Course])
async def list_courses():
    return list(_courses.values())


@router.post("/courses", response_model=Course)
async def create_course(course: Course):
    global _next_course_id
    course.id = _next_course_id
    _courses[_next_course_id] = course
    _next_course_id += 1
    return course


@router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: int):
    course = _courses.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
