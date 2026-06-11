from uuid import UUID

from fastcrud import compute_offset
from fastcrud.types import GetMultiResponseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    ConflictException,
    ErrorCode,
    NotFoundException,
)
from app.crud.address import crud_address
from app.schemas.address import (
    AddressCreate,
    AddressCreateDB,
    AddressRead,
    AddressUpdate,
)


class AddressService:
    async def create_address(
        self,
        session: AsyncSession,
        user_id: UUID,
        payload: AddressCreate,
    ) -> AddressRead:
        existing = await crud_address.get(
            db=session,
            user_id=user_id,
            line1=payload.line1,
            line2=payload.line2,
            city=payload.city,
            state=payload.state,
            postal_code=payload.postal_code,
            country=payload.country,
        )

        if existing:
            raise ConflictException(
                message="Address already exists",
                error_code=ErrorCode.ADDRESS_ALREADY_EXISTS,
            )

        if payload.is_default:
            current_default = await crud_address.get(
                db=session,
                user_id=user_id,
                is_default=True,
            )

            if current_default:
                await crud_address.update(
                    db=session,
                    object={"is_default": False},
                    allow_multiple=True,
                    user_id=user_id,
                    is_default=True,
                )

        address = await crud_address.create(
            db=session,
            object=AddressCreateDB(
                **payload.model_dump(),
                user_id=user_id,
            ),
            schema_to_select=AddressRead,
            return_as_model=True,
        )

        if address is None:
            raise RuntimeError("Failed to create address")

        return address

    async def get_address(
        self,
        *,
        session: AsyncSession,
        user_id: UUID,
        address_id: int,
    ) -> AddressRead:
        address = await crud_address.get(
            db=session,
            id=address_id,
            user_id=user_id,
            schema_to_select=AddressRead,
            return_as_model=True,
        )

        if not address:
            raise NotFoundException(
                resource="Address",
                identifier=address_id,
                error_code=ErrorCode.ADDRESS_NOT_FOUND,
            )

        return address

    async def list_addresses(
        self,
        session: AsyncSession,
        user_id: UUID,
        page: int,
        page_size: int,
    ) -> GetMultiResponseModel[AddressRead]:

        return await crud_address.get_multi(
            db=session,
            user_id=user_id,
            offset=compute_offset(page, page_size),
            limit=page_size,
            return_total_count=True,
            schema_to_select=AddressRead,
            return_as_model=True,
        )

    async def update_address(
        self,
        session: AsyncSession,
        user_id: UUID,
        address_id: int,
        payload: AddressUpdate,
    ) -> AddressRead:
        current_address = await self.get_address(
            session=session,
            user_id=user_id,
            address_id=address_id,
        )

        update_data = payload.model_dump(exclude_unset=True)

        # Check duplicate address
        address_fields = {
            "line1": update_data.get("line1", current_address.line1),
            "line2": update_data.get("line2", current_address.line2),
            "city": update_data.get("city", current_address.city),
            "state": update_data.get("state", current_address.state),
            "postal_code": update_data.get(
                "postal_code",
                current_address.postal_code,
            ),
            "country": update_data.get(
                "country",
                current_address.country,
            ),
        }

        existing = await crud_address.get(
            db=session,
            user_id=user_id,
            id__ne=address_id,
            **address_fields,
        )

        if existing:
            raise ConflictException(
                message="Address already exists",
                error_code=ErrorCode.ADDRESS_ALREADY_EXISTS,
            )

        # Make this the only default address
        if update_data.get("is_default") is True:
            await crud_address.update(
                db=session,
                object={"is_default": False},
                allow_multiple=True,
                user_id=user_id,
                id__ne=address_id,
            )

        updated = await crud_address.update(
            db=session,
            object=update_data,
            id=address_id,
            user_id=user_id,
            schema_to_select=AddressRead,
            return_as_model=True,
        )

        if updated is None:
            raise RuntimeError("Failed to update address")

        return updated

    async def delete_address(
        self,
        session: AsyncSession,
        user_id: UUID,
        address_id: int,
    ) -> None:
        await self.get_address(
            session=session,
            user_id=user_id,
            address_id=address_id,
        )

        await crud_address.delete(
            db=session,
            id=address_id,
        )


address_service = AddressService()
