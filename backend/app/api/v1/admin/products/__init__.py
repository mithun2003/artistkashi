from fastapi import APIRouter

from .categories import router as categories_router
from .images import router as images_router
from .mediums import router as mediums_router
from .products import router as products_router
from .variant_types import router as variant_types_router
from .variants import router as variants_router

router = APIRouter(tags=["ADMIN PRODUCTS"])

router.include_router(categories_router, prefix="/product-categories")

router.include_router(mediums_router, prefix="/product-mediums")

router.include_router(variant_types_router, prefix="/variant-types")

router.include_router(products_router, prefix="/products")

router.include_router(variants_router, prefix="/variants")

router.include_router(images_router, prefix="/images")
