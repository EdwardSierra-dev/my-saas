"""User domain entity."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from app.shared.constants.enums import UserRole


@dataclass
class User:
    """User entity representing a system user."""
    
    id: Optional[int]
    email: str
    name: str
    role: UserRole
    phone: Optional[str] = None
    password_hash: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    tenant_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def is_business_owner(self) -> bool:
        """Check if user is a business owner."""
        return self.role == UserRole.BUSINESS_OWNER
    
    def is_customer(self) -> bool:
        """Check if user is a customer."""
        return self.role == UserRole.CUSTOMER
    
    def is_admin(self) -> bool:
        """Check if user is an admin."""
        return self.role == UserRole.SUPER_ADMIN
    
    def can_access_tenant(self, tenant_id: int) -> bool:
        """
        Check if user can access a specific tenant.
        
        Args:
            tenant_id: Tenant ID to check access for
            
        Returns:
            bool: True if user can access the tenant
        """
        # Super admins can access all tenants
        if self.is_admin():
            return True
        
        # Users can only access their own tenant
        return self.tenant_id == tenant_id
    
    def has_password(self) -> bool:
        """Check if user has a password set."""
        return self.password_hash is not None
