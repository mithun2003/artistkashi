from datetime import UTC, datetime
from typing import Any, TypeVar

from fastcrud import PaginatedListResponse
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")


class Meta(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    error_code: str | None = None


class Pagination(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int


class SuccessResponse[T](GenericModel):
    success: bool = True
    status: int = 200
    message: str
    data: T | None = None
    meta: Meta = Field(default_factory=Meta)


class PaginatedResponse[T](PaginatedListResponse[T]):
    pass


class ErrorResponse(BaseModel):
    success: bool = False
    status: int
    message: str
    errors: dict[str, Any] | None = None
    meta: Meta = Field(default_factory=Meta)
