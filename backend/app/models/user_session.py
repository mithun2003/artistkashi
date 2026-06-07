# app/models/user_session.py


from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import Base


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("user.id"),
        nullable=False,
        index=True,
    )

    refresh_token_hash = Column(
        String,
        nullable=False,
    )

    device_name = Column(String(255))
    ip_address = Column(String(100))

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    last_used_at = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    user = relationship("User")
