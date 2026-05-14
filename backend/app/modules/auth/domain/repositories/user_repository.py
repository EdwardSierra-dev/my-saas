"""User repository interface."""

from abc import ABC, abstractmethod
from typing import Optional, List

from ..entities.user import User


class UserRepository(ABC):
    """Interface for user data access."""
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        """
        Get user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            Optional[User]: User if found, None otherwise
        """
        pass
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email.
        
        Args:
            email: User email
            
        Returns:
            Optional[User]: User if found, None otherwise
        """
        pass
    
    @abstractmethod
    def create(self, user: User) -> User:
        """
        Create a new user.
        
        Args:
            user: User entity to create
            
        Returns:
            User: Created user with ID
        """
        pass
    
    @abstractmethod
    def update(self, user: User) -> User:
        """
        Update existing user.
        
        Args:
            user: User entity to update
            
        Returns:
            User: Updated user
        """
        pass
    
    @abstractmethod
    def list_by_tenant(self, tenant_id: int, skip: int = 0, limit: int = 100) -> List[User]:
        """
        List all users for a tenant.
        
        Args:
            tenant_id: Tenant ID
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List[User]: List of users
        """
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> bool:
        """
        Delete user (soft delete).
        
        Args:
            user_id: User ID
            
        Returns:
            bool: True if deleted successfully
        """
        pass
