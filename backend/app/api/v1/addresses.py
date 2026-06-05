from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import CurrentUserDep
from app.core.db import get_async_session
from app.crud.address import crud_address
from app.schemas.address import AddressCreate, AddressRead
from app.schemas.responses import ResponseModel

get_async_session_dep = Depends(get_async_session)
router = APIRouter(tags=["addresses"])


@router.post("/addresses", response_model=ResponseModel[AddressRead])
async def create_address(
    payload: AddressCreate,
    user: CurrentUserDep,
    session: AsyncSession = get_async_session_dep,
):
    """Create address for current user using FastCRUD."""
    address = await crud_address.create(
        db=session, object={**payload.model_dump(), "user_id": user.id}
    )
    return ResponseModel(message="Address created successfully", data=address)


@router.get("/addresses", response_model=ResponseModel[list[AddressRead]])
async def list_addresses(
    user: CurrentUserDep,
    session: AsyncSession = get_async_session_dep,
):
    """List addresses for current user using FastCRUD."""
    addresses = await crud_address.get_multi(db=session, user_id=user.id)
    return ResponseModel(
        message="Addresses retrieved successfully",
        data=addresses["data"]
        if isinstance(addresses, dict) and "data" in addresses
        else addresses,
    )


@router.delete("/addresses/{address_id}", response_model=ResponseModel[dict])
async def delete_address(
    address_id: int,
    user: CurrentUserDep,
    session: AsyncSession = get_async_session_dep,
):
    """Delete address for current user using FastCRUD."""
    # First check ownership
    address = await crud_address.get(db=session, id=address_id, user_id=user.id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    await crud_address.delete(db=session, id=address_id)
    return ResponseModel(message="Address deleted successfully", data={"deleted": True})
