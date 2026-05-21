"""Get business detail use case."""

from dataclasses import dataclass
from typing import Optional

from app.shared.exceptions import NotFoundError
from ...domain.entities.tenant import Tenant
from ...domain.entities.user import User
from ...domain.repositories.tenant_repository import TenantRepository
from ...domain.repositories.user_repository import UserRepository


@dataclass
class GetBusinessDetailRequest:
    """Request for getting business detail."""
    
    business_id: int


@dataclass
class GetBusinessDetailResponse:
    """Response for business detail."""
    
    business: Tenant
    owner: User


class GetBusinessDetail:
    """Use case for getting business detail."""
    
    def __init__(
        self,
        tenant_repository: TenantRepository,
        user_repository: UserRepository
    ):
        self.tenant_repository = tenant_repository
        self.user_repository = user_repository
    
    def execute(self, request: GetBusinessDetailRequest) -> GetBusinessDetailResponse:
        """
        Execute get business detail.
        
        Args:
            request: Request with business ID
            
        Returns:
            GetBusinessDetailResponse with business and owner info
            
        Raises:
            NotFoundError: If business not found
        """
        # Get business (tenant)
        business = self.tenant_repository.find_by_id(request.business_id)
        if not business:
            raise NotFoundError(
                message=f"Business with ID {request.business_id} not found",
                code="BUSINESS_NOT_FOUND"
            )
        
        # Get business owner
        owner = self.user_repository.find_by_tenant_id(business.id)
        if not owner:
            raise NotFoundError(
                message=f"Business owner not found for business ID {request.business_id}",
                code="OWNER_NOT_FOUND"
            )
        
        return GetBusinessDetailResponse(
            business=business,
            owner=owner
        )
