from datetime import UTC, datetime
from typing import Any, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.exceptions import ErrorCode

T = TypeVar("T")


class Meta(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    request_id: UUID | None = None


class Pagination(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_prev: bool


class SuccessResponse[T](BaseModel):
    success: bool = True
    status: int = 200
    message: str
    data: T | None = None
    meta: Meta = Field(default_factory=Meta)


class PaginatedResponse[T](BaseModel):
    success: bool = True
    status: int = 200
    message: str
    data: list[T] = Field(default_factory=list)
    pagination: Pagination
    meta: Meta = Field(default_factory=Meta)


class ErrorResponse(BaseModel):
    success: bool = False
    status: int
    message: str
    error_code: ErrorCode
    errors: dict[str, Any] | None = None
    meta: Meta = Field(default_factory=Meta)
