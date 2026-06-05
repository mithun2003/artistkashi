from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.review import ReviewStatus, ReviewType


class ReviewBase(BaseModel):
    type: ReviewType
    entity_id: int | None = None
    rating: int = Field(..., ge=1, le=5)
    text: str = Field(..., min_length=1, max_length=1000)


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    status: ReviewStatus | None = None
    rating: int | None = Field(None, ge=1, le=5)
    text: str | None = Field(None, min_length=1, max_length=1000)


class ReviewRead(ReviewBase):
    id: UUID
    user_id: UUID
    status: ReviewStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReviewReadPublic(ReviewBase):
    """Public version without sensitive info"""

    id: UUID
    status: ReviewStatus
    created_at: datetime

    class Config:
        from_attributes = True
