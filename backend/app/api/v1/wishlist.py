from fastapi import APIRouter

from app.api.dependencies import CurrentUserDep, DatabaseDep
from app.core.exceptions import ErrorCode, NotFoundException
from app.crud.wishlist import crud_wishlist
from app.schemas.responses import SuccessResponse
from app.schemas.wishlist import WishlistCreate, WishlistRead

router = APIRouter(tags=["wishlist"], prefix="/wishlist")


@router.get("", response_model=SuccessResponse[list[WishlistRead]])
async def get_my_wishlist(user: CurrentUserDep, db: DatabaseDep) -> SuccessResponse:
    wishlist = await crud_wishlist.get_multi(db=db, user_id=user.id)
    data = (
        wishlist["data"]
        if isinstance(wishlist, dict) and "data" in wishlist
        else wishlist
    )
    return SuccessResponse(message="Wishlist retrieved successfully", data=data)


@router.post("", response_model=SuccessResponse[WishlistRead])
async def add_to_wishlist(
    item_in: WishlistCreate, user: CurrentUserDep, db: DatabaseDep
) -> SuccessResponse:
    # Check if already in wishlist
    existing = await crud_wishlist.get(
        db=db,
        user_id=user.id,
        product_id=item_in.product_id,
        course_id=item_in.course_id,
    )
    if existing:
        return SuccessResponse(message="Item already in wishlist", data=existing)

    item = await crud_wishlist.create(
        db=db, object={**item_in.model_dump(), "user_id": user.id}
    )
    return SuccessResponse(message="Item added to wishlist", data=item)


@router.delete("/{item_id}", response_model=SuccessResponse[None])
async def remove_from_wishlist(
    item_id: int, user: CurrentUserDep, db: DatabaseDep
) -> SuccessResponse:
    item = await crud_wishlist.get(db=db, id=item_id, user_id=user.id)
    if not item:
        raise NotFoundException(
            resource="Wishlist item",
            identifier=item_id,
            error_code=ErrorCode.RESOURCE_NOT_FOUND,
        )

    await crud_wishlist.delete(db=db, id=item_id)
    return SuccessResponse(message="Item removed from wishlist")
