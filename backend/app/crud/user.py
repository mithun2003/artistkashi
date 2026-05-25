from fastcrud import FastCRUD
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

crud_user = FastCRUD(User)
