"""Business discovery API endpoints for customers."""

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.shared.exceptions import NotFoundError
from app.shared.constants.enums import BusinessType, ColombiaDepartment
from ....application.use_cases.search_businesses import (
    SearchBusinesses,
    SearchBusinessesRequest,
)
from ....application.use_cases.get_business_detail import (
    GetBusinessDetail,
    GetBusinessDetailRequest,
)
from ....infrastructure.persistence.repositories.tenant_repository_impl import TenantRepositoryImpl
from ....infrastructure.persistence.repositories.user_repository_impl import UserRepositoryImpl
from ...schemas.business import (
    BusinessSearchResponseSchema,
    BusinessListItemSchema,
    BusinessDetailSchema,
)


router = APIRouter(prefix="/businesses", tags=["business-discovery"])


@router.get(
    "/search",
    response_model=BusinessSearchResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Search businesses",
    description="Search and filter businesses by name, type, and location"
)
async def search_businesses(
    query: Optional[str] = Query(None, description="Search by business name"),
    business_type: Optional[BusinessType] = Query(None, description="Filter by business type"),
    city: Optional[str] = Query(None, description="Filter by city"),
    department: Optional[ColombiaDepartment] = Query(None, description="Filter by department"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Search businesses with filters.
    
    **Query Parameters:**
    - query: Search by business name (partial match, case-insensitive)
    - business_type: Filter by business type (barbershop, spa, restaurant, etc.)
    - city: Filter by city (partial match, case-insensitive)
    - department: Filter by Colombian department
    - page: Page number (default: 1)
    - page_size: Items per page (default: 20, max: 100)
    
    **Returns:**
    - businesses: List of matching businesses
    - total: Total number of results
    - page: Current page
    - page_size: Items per page
    - total_pages: Total number of pages
    
    **Example:**
    ```
    GET /api/v1/businesses/search?query=barbería&city=Bogotá&page=1&page_size=20
    ```
    """
    try:
        # Create dependencies
        tenant_repository = TenantRepositoryImpl(db)
        
        # Create use case
        use_case = SearchBusinesses(tenant_repository=tenant_repository)
        
        # Execute use case
        use_case_request = SearchBusinessesRequest(
            query=query,
            business_type=business_type.value if business_type else None,
            city=city,
            department=department.value if department else None,
            page=page,
            page_size=page_size
        )
        
        result = use_case.execute(use_case_request)
        
        # Convert to response schema
        businesses = [
            BusinessListItemSchema(
                id=business.id,
                name=business.name,
                business_type=business.business_type,
                city=business.city or "",
                department=business.department or "",
                address=business.address,
                phone=business.phone,
                is_active=business.is_active,
                rating=None,  # TODO: Calculate from reviews
                total_reviews=0,  # TODO: Count from reviews
                created_at=business.created_at.isoformat() if business.created_at else ""
            )
            for business in result.businesses
        ]
        
        return BusinessSearchResponseSchema(
            businesses=businesses,
            total=result.total,
            page=result.page,
            page_size=result.page_size,
            total_pages=result.total_pages
        )
        
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error during business search: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        )


@router.get(
    "/{business_id}",
    response_model=BusinessDetailSchema,
    status_code=status.HTTP_200_OK,
    summary="Get business detail",
    description="Get detailed information about a specific business"
)
async def get_business_detail(
    business_id: int,
    db: Session = Depends(get_db)
):
    """
    Get business detail.
    
    **Path Parameters:**
    - business_id: Business ID
    
    **Returns:**
    - Business detailed information including owner info
    
    **Errors:**
    - 404: Business not found
    
    **Example:**
    ```
    GET /api/v1/businesses/1
    ```
    """
    try:
        # Create dependencies
        tenant_repository = TenantRepositoryImpl(db)
        user_repository = UserRepositoryImpl(db)
        
        # Create use case
        use_case = GetBusinessDetail(
            tenant_repository=tenant_repository,
            user_repository=user_repository
        )
        
        # Execute use case
        use_case_request = GetBusinessDetailRequest(business_id=business_id)
        result = use_case.execute(use_case_request)
        
        # Convert to response schema
        return BusinessDetailSchema(
            id=result.business.id,
            name=result.business.name,
            business_type=result.business.business_type,
            city=result.business.city or "",
            department=result.business.department or "",
            address=result.business.address,
            phone=result.business.phone,
            email=result.owner.email,
            is_active=result.business.is_active,
            rating=None,  # TODO: Calculate from reviews
            total_reviews=0,  # TODO: Count from reviews
            description=None,  # TODO: Add description field to tenant
            owner_name=result.owner.name,
            created_at=result.business.created_at.isoformat() if result.business.created_at else ""
        )
        
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": e.code,
                "message": e.message
            }
        )
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error getting business detail: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        )


@router.get(
    "/",
    response_model=BusinessSearchResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="List all businesses",
    description="Get a paginated list of all active businesses"
)
async def list_businesses(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    List all businesses.
    
    This is a convenience endpoint that returns all active businesses
    without any filters. Use /search for filtered results.
    
    **Query Parameters:**
    - page: Page number (default: 1)
    - page_size: Items per page (default: 20, max: 100)
    
    **Returns:**
    - Paginated list of all active businesses
    """
    # Reuse search endpoint with no filters
    return await search_businesses(
        query=None,
        business_type=None,
        city=None,
        department=None,
        page=page,
        page_size=page_size,
        db=db
    )


@router.get(
    "/health",
    summary="Health check",
    description="Check if the business discovery service is running"
)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "business-discovery",
        "version": "1.0.0"
    }
