from typing import Annotated

from fastapi import APIRouter, Query

from app.api.dependencies import CurrentUserDep, DatabaseDep
from app.crud.review import crud_review
from app.models.review import ReviewStatus, ReviewType
from app.schemas.responses import SuccessResponse
from app.schemas.review import ReviewCreate, ReviewRead, ReviewReadPublic

router = APIRouter(tags=["reviews"])


@router.get("/reviews", response_model=SuccessResponse[list[ReviewReadPublic]])
async def list_reviews(
    db: DatabaseDep,
    review_type: Annotated[ReviewType | None, Query()] = None,
    entity_id: Annotated[int | None, Query()] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> SuccessResponse:
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
    return SuccessResponse(message="Reviews retrieved successfully", data=data)


@router.post("/reviews", response_model=SuccessResponse[ReviewRead])
async def create_review(
    review_in: ReviewCreate,
    user: CurrentUserDep,
    db: DatabaseDep,
) -> SuccessResponse:
    """Create a new review (requires login)."""
    review = await crud_review.create(
        db=db,
        object={
            **review_in.model_dump(),
            "user_id": user.id,
            "status": ReviewStatus.pending,
        },
    )
    return SuccessResponse(
        message="Review created successfully (awaiting moderation)", data=review
    )


@router.get("/reviews/user/my-reviews", response_model=SuccessResponse[list[ReviewRead]])
async def get_my_reviews(
    user: CurrentUserDep,
    db: DatabaseDep,
) -> SuccessResponse:
    """Get current user's reviews."""
    reviews = await crud_review.get_multi(db=db, user_id=user.id)

    data = (
        reviews["data"] if isinstance(reviews, dict) and "data" in reviews else reviews
    )
    return SuccessResponse(message="Your reviews retrieved successfully", data=data)
