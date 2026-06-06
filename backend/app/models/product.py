from sqlalchemy import Column, Float, Integer, String, Text

from app.models.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    artist = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String(512), nullable=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    stock_quantity = Column(Integer, default=1)  # For original art, usually 1

    # Relationships can be added here
    # reviews = relationship("Review", back_populates="product")
