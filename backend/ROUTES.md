Overview of where to put endpoints and what each folder is for

- backend/api/index.py
  - Deployment entrypoint used by platforms (Vercel). It imports the ASGI app from app.main.

- backend/app/main.py
  - Application factory: register routers, middleware, pagination, and auth here.

- backend/app/routes/
  - Place REST endpoints here. Each file should register an APIRouter (no global app usage).
  - Examples (created):
    - routes/users.py       -> public/profile endpoints using current_active_user
    - routes/courses.py     -> course CRUD (example in-memory)
    - routes/products.py    -> product CRUD (example in-memory)
    - routes/admin.py       -> admin-only endpoints (use current_active_user and check is_superuser)
    - routes/items.py       -> demo CRUD added earlier
    - routes/test.py        -> simple health/test endpoints

- backend/app/schemas/
  - Pydantic shapes (request/response models) live here.

- backend/app/models/
  - DB models / ORM tables live here (SQLAlchemy). Keep data structure here.

- backend/app/services/
  - Business logic, email sending, background tasks — import from routes.

- backend/app/auth/
  - Authentication setup (fastapi-users), user manager and dependencies.

Where to add new endpoints
- Create a new file under backend/app/routes, register router = APIRouter(tags=[...]) and export endpoints there.
- Import that router in backend/app/main.py and call app.include_router(your_router).
- Use dependencies for auth: from app.auth.users import current_active_user

Start the server and explore
- cd backend && uvicorn app.main:app --reload
- Open docs at http://127.0.0.1:8000/docs to see all routes with examples
