import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Enum, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class ReviewType(enum.StrEnum):
    COURSE = "course"
    PAINTING = "painting"


class ReviewStatus(enum.StrEnum):
    ACTIVE = "active"
    BLOCKED = "blocked"


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_review_rating"),
    )
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    type: Mapped[ReviewType] = mapped_column(
        Enum(ReviewType),
        nullable=False,
        index=True,
    )

    entity_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    comment: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[ReviewStatus] = mapped_column(
        Enum(ReviewStatus),
        default=ReviewStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="reviews",
    )
