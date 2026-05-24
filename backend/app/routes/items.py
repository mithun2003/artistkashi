from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["items"])


class Item(BaseModel):
    id: int | None = None
    name: str
    description: str | None = None


_items: dict[int, Item] = {}
_next_id = 1


@router.get("/items", response_model=List[Item])
async def list_items():
    return list(_items.values())


@router.post("/items", response_model=Item)
async def create_item(item: Item):
    global _next_id
    item.id = _next_id
    _items[_next_id] = item
    _next_id += 1
    return item


@router.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    item = _items.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: Item):
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="Item not found")
    item.id = item_id
    _items[item_id] = item
    return item


@router.delete("/items/{item_id}")
async def delete_item(item_id: int):
    if item_id in _items:
        del _items[item_id]
        return {"deleted": True}
    raise HTTPException(status_code=404, detail="Item not found")
