import enum

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, Enum, String
from sqlalchemy.orm import relationship

from app.models.base import Base


class Role(enum.StrEnum):
    user = "user"
    admin = "admin"


class User(SQLAlchemyBaseUserTableUUID, Base):
    # Additional user profile fields
    full_name = Column(String(length=255), nullable=True)
    phone = Column(String(length=32), nullable=True)
    role = Column(Enum(Role), nullable=False, server_default=Role.user.value)
    # Note: addresses are a separate table linked by foreign key (see Address model)
    addresses = relationship(
        "Address", back_populates="user", lazy="selectin", cascade="all, delete-orphan"
    )
