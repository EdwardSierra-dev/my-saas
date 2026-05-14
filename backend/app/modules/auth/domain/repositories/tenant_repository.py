"""Tenant repository interface."""

from abc import ABC, abstractmethod
from typing import Optional

from ..entities.tenant import Tenant


class TenantRepository(ABC):
    """Interface for tenant data access."""
    
    @abstractmethod
    def get_by_id(self, tenant_id: int) -> Optional[Tenant]:
        """
        Get tenant by ID.
        
        Args:
            tenant_id: Tenant ID
            
        Returns:
            Optional[Tenant]: Tenant if found, None otherwise
        """
        pass
    
    @abstractmethod
    def get_by_slug(self, slug: str) -> Optional[Tenant]:
        """
        Get tenant by slug.
        
        Args:
            slug: Tenant slug
            
        Returns:
            Optional[Tenant]: Tenant if found, None otherwise
        """
        pass
    
    @abstractmethod
    def create(self, tenant: Tenant) -> Tenant:
        """
        Create a new tenant.
        
        Args:
            tenant: Tenant entity to create
            
        Returns:
            Tenant: Created tenant with ID
        """
        pass
    
    @abstractmethod
    def update(self, tenant: Tenant) -> Tenant:
        """
        Update existing tenant.
        
        Args:
            tenant: Tenant entity to update
            
        Returns:
            Tenant: Updated tenant
        """
        pass
