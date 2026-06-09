from __future__ import annotations

from uuid import UUID

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Wishlist(Base, TimestampMixin):
    __tablename__ = "wishlist"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    product_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "products.id",
            ondelete="CASCADE",
        ),
        nullable=True,
    )

    course_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "courses.id",
            ondelete="CASCADE",
        ),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="wishlist_items",
    )

    product = relationship(
        "Product",
    )

    course = relationship(
        "Course",
    )
