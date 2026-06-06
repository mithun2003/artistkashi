from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import Base


class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )

    # We can have either a product or a course in the wishlist
    product_id = Column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=True
    )
    course_id = Column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=True
    )

    user = relationship("User", backref="wishlist_items")
    product = relationship("Product")
    course = relationship("Course")
