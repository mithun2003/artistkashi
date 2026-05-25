from fastcrud import FastCRUD
from app.models.address import Address
from app.schemas.address import AddressCreate, AddressUpdate

crud_address = FastCRUD(Address)
