from app.crud.base import BaseCRUD
from app.models.user import User
from app.models.user_session import UserSession

crud_user = BaseCRUD(User)
crud_user_session = BaseCRUD(UserSession)
