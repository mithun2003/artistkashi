from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.models.address import Address
from app.auth.users import current_active_user

router = APIRouter(tags=["addresses"])


class AddressIn(BaseModel):
    line1: str
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    phone: str | None = None
    is_default: bool | None = False


@router.post("/addresses", response_model=dict)
async def create_address(payload: AddressIn, user=Depends(current_active_user), session: AsyncSession = Depends(get_async_session)):
    """Create address for current user (DB-backed)."""
    addr = Address(
        user_id=user.id,
        line1=payload.line1,
        line2=payload.line2,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        country=payload.country,
        phone=payload.phone,
        is_default=payload.is_default or False,
    )
    session.add(addr)
    await session.commit()
    await session.refresh(addr)
    return {"id": addr.id}


@router.get("/addresses", response_model=List[dict])
async def list_addresses(user=Depends(current_active_user), session: AsyncSession = Depends(get_async_session)):
    q = await session.execute(
        Address.__table__.select().where(Address.user_id == user.id)
    )
    rows = q.fetchall()
    return [dict(r) for r in rows]


@router.delete("/addresses/{address_id}")
async def delete_address(address_id: int, user=Depends(current_active_user), session: AsyncSession = Depends(get_async_session)):
    q = await session.get(Address, address_id)
    if not q or q.user_id != user.id:
        raise HTTPException(status_code=404, detail="Address not found")
    await session.delete(q)
    await session.commit()
    return {"deleted": True}
