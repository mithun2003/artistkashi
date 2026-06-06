from sqlalchemy import Column, Float, Integer, String, Text

from app.models.base import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    instructor = Column(String(255), nullable=False)
    duration = Column(String(100), nullable=True)
    rating = Column(Float, default=0.0)
    students_count = Column(Integer, default=0)
    image_url = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=True)

    # Relationships can be added here (e.g., reviews, students)
    # reviews = relationship("Review", back_populates="course")
