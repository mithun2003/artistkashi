from fastcrud import FastCRUD

from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate

crud_review = FastCRUD(Review)
