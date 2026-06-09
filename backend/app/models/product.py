from __future__ import annotations

from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin


class Product(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    artist: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="ArtistKashi",
    )
    price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    stock_quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
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
