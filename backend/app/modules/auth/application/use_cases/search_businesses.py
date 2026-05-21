"""Search businesses use case."""

from dataclasses import dataclass
from typing import Optional, List
from math import ceil

from app.shared.constants.enums import BusinessType, ColombiaDepartment
from ...domain.entities.tenant import Tenant
from ...domain.repositories.tenant_repository import TenantRepository


@dataclass
class SearchBusinessesRequest:
    """Request for searching businesses."""
    
    query: Optional[str] = None
    business_type: Optional[str] = None
    city: Optional[str] = None
    department: Optional[str] = None
    page: int = 1
    page_size: int = 20


@dataclass
class SearchBusinessesResponse:
    """Response for business search."""
    
    businesses: List[Tenant]
    total: int
    page: int
    page_size: int
    total_pages: int


class SearchBusinesses:
    """Use case for searching businesses."""
    
    def __init__(self, tenant_repository: TenantRepository):
        self.tenant_repository = tenant_repository
    
    def execute(self, request: SearchBusinessesRequest) -> SearchBusinessesResponse:
        """
        Execute business search.
        
        Args:
            request: Search request with filters
            
        Returns:
            SearchBusinessesResponse with paginated results
        """
        # Get all tenants (businesses)
        all_tenants = self.tenant_repository.find_all()
        
        # Filter by query (name search)
        if request.query:
            query_lower = request.query.lower()
            all_tenants = [
                t for t in all_tenants 
                if query_lower in t.name.lower()
            ]
        
        # Filter by business type
        if request.business_type:
            all_tenants = [
                t for t in all_tenants 
                if t.business_type == request.business_type
            ]
        
        # Filter by city
        if request.city:
            city_lower = request.city.lower()
            all_tenants = [
                t for t in all_tenants 
                if t.city and city_lower in t.city.lower()
            ]
        
        # Filter by department
        if request.department:
            all_tenants = [
                t for t in all_tenants 
                if t.department == request.department
            ]
        
        # Filter only active businesses
        all_tenants = [t for t in all_tenants if t.is_active]
        
        # Calculate pagination
        total = len(all_tenants)
        total_pages = ceil(total / request.page_size) if total > 0 else 1
        
        # Apply pagination
        start_idx = (request.page - 1) * request.page_size
        end_idx = start_idx + request.page_size
        paginated_tenants = all_tenants[start_idx:end_idx]
        
        return SearchBusinessesResponse(
            businesses=paginated_tenants,
            total=total,
            page=request.page,
            page_size=request.page_size,
            total_pages=total_pages
        )
