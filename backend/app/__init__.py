from .main import app
from fastapi_pagination import add_pagination
from app.routes.health import router as health_router
from app.routes.test import router as test_router
from app.routes.items import router as items_router
from app.routes.users import router as users_router
from app.routes.courses import router as courses_router
from app.routes.products import router as products_router
from app.routes.admin import router as admin_router

# Register routers in one place (convention used in many projects)
app.include_router(health_router)
app.include_router(test_router)
app.include_router(items_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(products_router)
app.include_router(admin_router)
app.include_router(addresses_router)

# Add pagination integration
add_pagination(app)
