from typing import Any, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.dependencies import get_db
from app.core.auth.users import current_active_user
from app.crud.review import crud_review
from app.models.review import ReviewType, ReviewStatus
from app.schemas.responses import ResponseModel
from app.schemas.review import ReviewCreate, ReviewRead, ReviewReadPublic

router = APIRouter(tags=["reviews"])


@router.get("/reviews", response_model=ResponseModel[list[ReviewReadPublic]])
async def list_reviews(
    review_type: Optional[ReviewType] = Query(None),
    entity_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
):
    """Get approved reviews (public endpoint)."""
    # Using get_multi directly with filters to reduce boilerplate
    filters = {"status": ReviewStatus.approved}
    if review_type:
        filters["type"] = review_type
    if entity_id is not None:
        filters["entity_id"] = entity_id

    reviews = await crud_review.get_multi(db=db, offset=skip, limit=limit, **filters)

    data = (
        reviews["data"] if isinstance(reviews, dict) and "data" in reviews else reviews
    )
    return ResponseModel(message="Reviews retrieved successfully", data=data)


@router.post("/reviews", response_model=ResponseModel[ReviewRead])
async def create_review(
    review_in: ReviewCreate,
    db=Depends(get_db),
    user: Any = Depends(current_active_user),
):
    """Create a new review (requires login)."""
    review = await crud_review.create(
        db=db,
        object={
            **review_in.model_dump(),
            "user_id": user.id,
            "status": ReviewStatus.pending,
        },
    )
    return ResponseModel(
        message="Review created successfully (awaiting moderation)", data=review
    )


@router.get("/reviews/user/my-reviews", response_model=ResponseModel[list[ReviewRead]])
async def get_my_reviews(
    db=Depends(get_db),
    user: Any = Depends(current_active_user),
):
    """Get current user's reviews."""
    reviews = await crud_review.get_multi(db=db, user_id=user.id)

    data = (
        reviews["data"] if isinstance(reviews, dict) and "data" in reviews else reviews
    )
    return ResponseModel(message="Your reviews retrieved successfully", data=data)
