from fastapi import APIRouter

from app.api.dependencies import CurrentUserDep, DatabaseDep
from app.core.exceptions import ErrorCode, NotFoundException
from app.crud.cart import crud_cart
from app.schemas.cart import CartItemCreate, CartItemRead, CartItemUpdate
from app.schemas.responses import SuccessResponse

router = APIRouter(tags=["cart"], prefix="/cart")


@router.get("", response_model=SuccessResponse[list[CartItemRead]])
async def get_my_cart(user: CurrentUserDep, db: DatabaseDep) -> SuccessResponse:
    cart = await crud_cart.get_multi(db=db, user_id=user.id)
    data = cart["data"] if isinstance(cart, dict) and "data" in cart else cart
    return SuccessResponse(message="Cart retrieved successfully", data=data)


@router.post("", response_model=SuccessResponse[CartItemRead])
async def add_to_cart(
    item_in: CartItemCreate, user: CurrentUserDep, db: DatabaseDep
) -> SuccessResponse:
    # Check if already in cart
    existing = await crud_cart.get(
        db=db,
        user_id=user.id,
        product_id=item_in.product_id,
        course_id=item_in.course_id,
    )
    if existing:
        # Update quantity
        updated = await crud_cart.update(
            db=db,
            id=existing.id,
            object={"quantity": existing.quantity + item_in.quantity},
        )
        return SuccessResponse(message="Cart item quantity updated", data=updated)

    item = await crud_cart.create(
        db=db, object={**item_in.model_dump(), "user_id": user.id}
    )
    return SuccessResponse(message="Item added to cart", data=item)


@router.patch("/{item_id}", response_model=SuccessResponse[CartItemRead])
async def update_cart_item(
    item_id: int, item_in: CartItemUpdate, user: CurrentUserDep, db: DatabaseDep
) -> SuccessResponse:
    item = await crud_cart.get(db=db, id=item_id, user_id=user.id)
    if not item:
        raise NotFoundException(
            resource="Cart item",
            identifier=item_id,
            error_code=ErrorCode.RESOURCE_NOT_FOUND,
        )

    updated = await crud_cart.update(db=db, id=item_id, object=item_in.model_dump())
    return SuccessResponse(message="Cart item updated", data=updated)


@router.delete("/{item_id}", response_model=SuccessResponse[None])
async def remove_from_cart(
    item_id: int, user: CurrentUserDep, db: DatabaseDep
) -> SuccessResponse:
    item = await crud_cart.get(db=db, id=item_id, user_id=user.id)
    if not item:
        raise NotFoundException(
            resource="Cart item",
            identifier=item_id,
            error_code=ErrorCode.RESOURCE_NOT_FOUND,
        )

    await crud_cart.delete(db=db, id=item_id)
    return SuccessResponse(message="Item removed from cart")
