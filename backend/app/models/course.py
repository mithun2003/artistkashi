from __future__ import annotations

from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin


class Course(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    subtitle: Mapped[str | None] = mapped_column(String(500), nullable=True)

    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    instructor: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="ArtistKashi",
    )

    level: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default="Beginner",
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    duration: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    lessons_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    rating: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    students_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    # reviews = relationship(
    #     "Review",
    #     cascade="all, delete-orphan",
    # )
