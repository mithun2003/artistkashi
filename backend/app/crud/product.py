from fastcrud import JoinConfig

from app.crud.base import BaseCRUD
from app.models.product import (
    Product,
    ProductCategory,
    ProductImage,
    ProductMedium,
    ProductVariant,
    VariantType,
)
from app.schemas.product import (
    ProductCategoryRead,
    ProductImageRead,
    ProductMediumRead,
    ProductVariantRead,
)

crud_product = BaseCRUD(Product)
crud_product_medium = BaseCRUD(ProductMedium)
crud_variant_type = BaseCRUD(VariantType)
crud_product_variant = BaseCRUD(ProductVariant)
crud_product_image = BaseCRUD(ProductImage)
crud_product_category = BaseCRUD(ProductCategory)

PRODUCT_RELATIONS = [
    "medium",
    "category",
    "images",
    "variants",
]

PRODUCT_LIST_JOINS = [
    JoinConfig(
        model=ProductMedium,
        join_on=Product.medium_id == ProductMedium.id,
        join_prefix="medium",
        schema_to_select=ProductMediumRead,
        relationship_type="one-to-one",
    ),
    JoinConfig(
        model=ProductCategory,
        join_on=Product.category_id == ProductCategory.id,
        join_prefix="category",
        schema_to_select=ProductCategoryRead,
        relationship_type="one-to-one",
    ),
    JoinConfig(
        model=ProductVariant,
        join_on=(
            (Product.id == ProductVariant.product_id)
            & (ProductVariant.is_default.is_(True))
        ),
        join_prefix="variant",
        schema_to_select=ProductVariantRead,
        relationship_type="one-to-one",
    ),
    JoinConfig(
        model=ProductImage,
        join_on=(
            (Product.id == ProductImage.product_id)
            & (ProductImage.is_primary.is_(True))
        ),
        join_prefix="image",
        schema_to_select=ProductImageRead,
        relationship_type="one-to-one",
    ),
]
