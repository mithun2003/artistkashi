from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )

    product_id = Column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=True
    )
    course_id = Column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=True
    )

    quantity = Column(Integer, default=1)

    user = relationship("User", backref="cart_items")
    product = relationship("Product")
    course = relationship("Course")
