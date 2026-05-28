"""Customer features API endpoints (profile, favorites, purchases, reviews)."""

from fastapi import APIRouter, Depends, status, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.core.security import decode_token
from ....infrastructure.persistence.models import UserModel, TenantModel
from ....infrastructure.persistence.customer_features_models import (
    CustomerFavoriteModel,
    CustomerPurchaseModel,
    CustomerReviewModel,
)


router = APIRouter(prefix="/customers", tags=["customer-features"])


# ============================================================================
# Authentication Dependency
# ============================================================================

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserModel:
    """Get the current authenticated user from JWT token."""
    token = credentials.credentials
    
    # Decode token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token type
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


# ============================================================================
# Schemas
# ============================================================================

class UpdateProfileRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)


class ProfileResponse(BaseModel):
    id: int
    email: str
    name: str
    avatar_url: Optional[str]
    auth_provider: Optional[str]


class AddFavoriteRequest(BaseModel):
    business_id: int


class FavoriteResponse(BaseModel):
    id: int
    business_id: int
    business_name: str
    business_type: str
    business_image: Optional[str]
    added_at: str


class PurchaseResponse(BaseModel):
    id: int
    business_name: str
    product_name: str
    purchase_date: str
    status: str
    total_amount: int


class PaginatedPurchasesResponse(BaseModel):
    items: List[PurchaseResponse]
    total: int
    page: int
    limit: int


class ReviewResponse(BaseModel):
    id: int
    business_name: str
    product_name: Optional[str]
    comment: str
    rating: int
    review_date: str


class PaginatedReviewsResponse(BaseModel):
    items: List[ReviewResponse]
    total: int
    page: int
    limit: int


# ============================================================================
# Profile Endpoints
# ============================================================================

@router.get(
    "/profile",
    response_model=ProfileResponse,
    summary="Get customer profile",
    description="Get the current customer's profile information"
)
async def get_profile(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer profile."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    # Get OAuth provider if exists
    auth_provider = None
    if current_user.oauth_accounts:
        auth_provider = current_user.oauth_accounts[0].provider
    
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        auth_provider=auth_provider
    )


@router.put(
    "/profile",
    response_model=ProfileResponse,
    summary="Update customer profile",
    description="Update customer name (email and auth provider cannot be changed)"
)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update customer profile."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    # Update name
    current_user.name = request.name
    db.commit()
    db.refresh(current_user)
    
    # Get OAuth provider if exists
    auth_provider = None
    if current_user.oauth_accounts:
        auth_provider = current_user.oauth_accounts[0].provider
    
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        auth_provider=auth_provider
    )


# ============================================================================
# Favorites Endpoints
# ============================================================================

@router.get(
    "/favorites",
    response_model=List[FavoriteResponse],
    summary="Get customer favorites",
    description="Get all favorites for the current customer (max 10)"
)
async def get_favorites(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer favorites."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    favorites = (
        db.query(CustomerFavoriteModel, TenantModel)
        .join(TenantModel, CustomerFavoriteModel.business_id == TenantModel.id)
        .filter(CustomerFavoriteModel.customer_id == current_user.id)
        .order_by(CustomerFavoriteModel.added_at.desc())
        .limit(10)
        .all()
    )
    
    return [
        FavoriteResponse(
            id=fav.id,
            business_id=tenant.id,
            business_name=tenant.name,
            business_type=tenant.business_type,
            business_image=tenant.logo_url,
            added_at=fav.added_at.isoformat()
        )
        for fav, tenant in favorites
    ]


@router.post(
    "/favorites",
    response_model=FavoriteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add favorite",
    description="Add a business to favorites (max 10 favorites)"
)
async def add_favorite(
    request: AddFavoriteRequest,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a business to favorites."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    # Check if already favorited
    existing = (
        db.query(CustomerFavoriteModel)
        .filter(
            CustomerFavoriteModel.customer_id == current_user.id,
            CustomerFavoriteModel.business_id == request.business_id
        )
        .first()
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Business already in favorites"
        )
    
    # Check favorites limit
    favorites_count = (
        db.query(CustomerFavoriteModel)
        .filter(CustomerFavoriteModel.customer_id == current_user.id)
        .count()
    )
    
    if favorites_count >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 favorites allowed"
        )
    
    # Check if business exists
    business = db.query(TenantModel).filter(TenantModel.id == request.business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    # Create favorite
    favorite = CustomerFavoriteModel(
        customer_id=current_user.id,
        business_id=request.business_id
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return FavoriteResponse(
        id=favorite.id,
        business_id=business.id,
        business_name=business.name,
        business_type=business.business_type,
        business_image=business.logo_url,
        added_at=favorite.added_at.isoformat()
    )


@router.delete(
    "/favorites/{favorite_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove favorite",
    description="Remove a business from favorites"
)
async def remove_favorite(
    favorite_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a business from favorites."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    favorite = (
        db.query(CustomerFavoriteModel)
        .filter(
            CustomerFavoriteModel.id == favorite_id,
            CustomerFavoriteModel.customer_id == current_user.id
        )
        .first()
    )
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return None


# ============================================================================
# Purchase History Endpoints
# ============================================================================

@router.get(
    "/purchases",
    response_model=PaginatedPurchasesResponse,
    summary="Get purchase history",
    description="Get customer purchase history with pagination (15 items per page)"
)
async def get_purchases(
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1, le=100),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer purchase history."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    # Get total count
    total = (
        db.query(CustomerPurchaseModel)
        .filter(CustomerPurchaseModel.customer_id == current_user.id)
        .count()
    )
    
    # Get paginated purchases
    purchases = (
        db.query(CustomerPurchaseModel, TenantModel)
        .join(TenantModel, CustomerPurchaseModel.business_id == TenantModel.id)
        .filter(CustomerPurchaseModel.customer_id == current_user.id)
        .order_by(CustomerPurchaseModel.purchase_date.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    
    items = [
        PurchaseResponse(
            id=purchase.id,
            business_name=tenant.name,
            product_name=purchase.product_name,
            purchase_date=purchase.purchase_date.isoformat(),
            status=purchase.status,
            total_amount=purchase.total_amount
        )
        for purchase, tenant in purchases
    ]
    
    return PaginatedPurchasesResponse(
        items=items,
        total=total,
        page=page,
        limit=limit
    )


# ============================================================================
# Review History Endpoints
# ============================================================================

@router.get(
    "/reviews",
    response_model=PaginatedReviewsResponse,
    summary="Get review history",
    description="Get customer review history with pagination (20 items per page)"
)
async def get_reviews(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer review history."""
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access this endpoint"
        )
    
    # Get total count
    total = (
        db.query(CustomerReviewModel)
        .filter(CustomerReviewModel.customer_id == current_user.id)
        .count()
    )
    
    # Get paginated reviews
    reviews = (
        db.query(CustomerReviewModel, TenantModel)
        .join(TenantModel, CustomerReviewModel.business_id == TenantModel.id)
        .filter(CustomerReviewModel.customer_id == current_user.id)
        .order_by(CustomerReviewModel.review_date.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    
    items = [
        ReviewResponse(
            id=review.id,
            business_name=tenant.name,
            product_name=review.product_name,
            comment=review.comment,
            rating=review.rating,
            review_date=review.review_date.isoformat()
        )
        for review, tenant in reviews
    ]
    
    return PaginatedReviewsResponse(
        items=items,
        total=total,
        page=page,
        limit=limit
    )
