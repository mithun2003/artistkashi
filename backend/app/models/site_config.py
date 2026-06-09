from sqlalchemy import JSON, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class SiteConfig(Base, TimestampMixin):
    __tablename__ = "site_config"

    key: Mapped[str] = mapped_column(
        String(100),
        primary_key=True,
    )

    value: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )


# from sqlalchemy import Boolean, Integer, String, Text
# from sqlalchemy.dialects.postgresql import JSONB
# from sqlalchemy.orm import Mapped, mapped_column

# from app.models.base import Base, TimestampMixin


# class HomeSection(Base, TimestampMixin):
#     __tablename__ = "home_sections"

#     id: Mapped[int] = mapped_column(
#         primary_key=True,
#         autoincrement=True,
#     )

#     section_key: Mapped[str] = mapped_column(
#         String(50),
#         unique=True,
#         index=True,
#     )

#     title: Mapped[str | None] = mapped_column(
#         String(255),
#         nullable=True,
#     )

#     content: Mapped[dict] = mapped_column(
#         JSONB,
#         nullable=False,
#     )

#     display_order: Mapped[int] = mapped_column(
#         Integer,
#         default=0,
#     )

#     is_active: Mapped[bool] = mapped_column(
#         Boolean,
#         default=True,
#     )
