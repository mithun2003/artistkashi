from sqlalchemy import Column, String, Integer, Enum, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum
import uuid
from datetime import datetime

from app.models.base import Base


class ReviewType(str, enum.Enum):
    site = "site"
    product = "product"
    painting = "painting"


class ReviewStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    blocked = "blocked"


class Review(Base):
    """
    Community reviews for site, products, and paintings.
    """
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(Enum(ReviewType), nullable=False, index=True)
    # For product/painting reviews, this stores the entity ID
    entity_id = Column(Integer, nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    text = Column(Text, nullable=False)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.pending, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="reviews")
