from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, index=True)
    line1 = Column(String(length=255), nullable=False)
    line2 = Column(String(length=255), nullable=True)
    city = Column(String(length=128), nullable=True)
    state = Column(String(length=128), nullable=True)
    postal_code = Column(String(length=32), nullable=True)
    country = Column(String(length=128), nullable=True)
    phone = Column(String(length=32), nullable=True)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")
