from datetime import datetime
from typing import TypeVar

from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")


class MetaModel(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ResponseModel[T](GenericModel):
    success: bool = True
    message: str
    data: T | None = None
    meta: MetaModel = Field(default_factory=MetaModel)


class ErrorResponseModel(BaseModel):
    success: bool = False
    message: str
    errors: dict[str, list[str]] | None = None
    meta: MetaModel = Field(default_factory=MetaModel)
