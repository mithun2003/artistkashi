from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

from app.models.review import ReviewType, ReviewStatus


class ReviewBase(BaseModel):
    type: ReviewType
    entity_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    text: str = Field(..., min_length=1, max_length=1000)


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    status: Optional[ReviewStatus] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    text: Optional[str] = Field(None, min_length=1, max_length=1000)


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
