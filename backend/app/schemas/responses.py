from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel, Field
from datetime import datetime

T = TypeVar("T")

class MetaModel(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ResponseModel(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: Optional[T] = None
    meta: MetaModel = Field(default_factory=MetaModel)

class ErrorResponseModel(BaseModel):
    success: bool = False
    message: str
    errors: Optional[dict[str, list[str]]] = None
    meta: MetaModel = Field(default_factory=MetaModel)
