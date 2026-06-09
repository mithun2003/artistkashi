from fastcrud import FastCRUD

from app.models.user import User
from app.models.user_session import UserSession

crud_user = FastCRUD(User)
crud_user_session = FastCRUD(UserSession)
