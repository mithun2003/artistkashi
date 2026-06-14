from pydantic import BaseModel, ConfigDict


class CourseBase(BaseModel):
    title: str
    subtitle: str | None = None
    instructor: str
    level: str | None = "Beginner"
    duration: str | None = None
    lessons_count: int = 0
    image_url: str | None = None
    description: str | None = None
    price: float
    category: str | None = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    title: str | None = None
    subtitle: str | None = None
    instructor: str | None = None
    price: float | None = None


class CourseRead(CourseBase):
    id: int
    rating: float
    students_count: int
    featured: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
