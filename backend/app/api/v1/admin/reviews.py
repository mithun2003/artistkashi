from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.dependencies import CurrentUserDep, DatabaseDep
from app.crud.review import crud_review
from app.models.review import ReviewStatus, ReviewType
from app.schemas.responses import ResponseModel
from app.schemas.review import ReviewRead, ReviewUpdate

router = APIRouter(tags=["admin-reviews"])


def _check_admin(user: CurrentUserDep) -> None:
    """Check if user is admin/superuser."""
    if not getattr(user, "is_superuser", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required"
        )


@router.get("/reviews", response_model=ResponseModel[list[ReviewRead]])
async def list_all_reviews(
    user: CurrentUserDep,
    db: DatabaseDep,
    review_type: Annotated[ReviewType | None, Query(None)] = None,
    entity_id: Annotated[int | None, Query(None)] = None,
    status: Annotated[ReviewStatus | None, Query(None)] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
):
    """List all reviews (admin only)."""
    _check_admin(user)

    filters = {}
    if review_type:
        filters["type"] = review_type
    if entity_id is not None:
        filters["entity_id"] = entity_id
    if status:
        filters["status"] = status

    reviews = await crud_review.get_multi(db=db, offset=skip, limit=limit, **filters)

    data = (
        reviews["data"] if isinstance(reviews, dict) and "data" in reviews else reviews
    )
    return ResponseModel(message="Reviews retrieved successfully", data=data)


@router.get("/reviews/{review_id}", response_model=ResponseModel[ReviewRead])
async def get_review_detail(
    review_id: UUID,
    user: CurrentUserDep,
    db: DatabaseDep,
):
    """Get a single review (admin only)."""
    _check_admin(user)
    review = await crud_review.get(db=db, id=review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )
    return ResponseModel(message="Review retrieved successfully", data=review)


@router.put("/reviews/{review_id}", response_model=ResponseModel[ReviewRead])
async def update_review(
    review_id: UUID,
    review_in: ReviewUpdate,
    user: CurrentUserDep,
    db: DatabaseDep,
):
    """Update review status or content (admin only)."""
    _check_admin(user)

    update_data = review_in.model_dump(exclude_unset=True)
    review = await crud_review.update(db=db, id=review_id, object=update_data)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )
    return ResponseModel(message="Review updated successfully", data=review)


@router.delete("/reviews/{review_id}", response_model=ResponseModel[dict])
async def delete_review(
    review_id: UUID,
    user: CurrentUserDep,
    db: DatabaseDep,
):
    """Delete a review (admin only)."""
    _check_admin(user)
    review = await crud_review.get(db=db, id=review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )

    await crud_review.delete(db=db, id=review_id)
    return ResponseModel(message="Review deleted successfully", data={})
