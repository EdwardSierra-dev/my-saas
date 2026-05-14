"""OAuth account repository interface."""

from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class OAuthAccount:
    """OAuth account entity."""
    
    id: Optional[int]
    user_id: int
    provider: str
    provider_user_id: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    profile_data: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class OAuthAccountRepository(ABC):
    """Interface for OAuth account data access."""
    
    @abstractmethod
    def get_by_user_and_provider(self, user_id: int, provider: str) -> Optional[OAuthAccount]:
        """
        Get OAuth account by user and provider.
        
        Args:
            user_id: User ID
            provider: OAuth provider name
            
        Returns:
            Optional[OAuthAccount]: OAuth account if found, None otherwise
        """
        pass
    
    @abstractmethod
    def get_by_provider_user_id(self, provider: str, provider_user_id: str) -> Optional[OAuthAccount]:
        """
        Get OAuth account by provider and provider user ID.
        
        Args:
            provider: OAuth provider name
            provider_user_id: User ID from OAuth provider
            
        Returns:
            Optional[OAuthAccount]: OAuth account if found, None otherwise
        """
        pass
    
    @abstractmethod
    def create(self, oauth_account: OAuthAccount) -> OAuthAccount:
        """
        Create a new OAuth account.
        
        Args:
            oauth_account: OAuth account entity to create
            
        Returns:
            OAuthAccount: Created OAuth account with ID
        """
        pass
    
    @abstractmethod
    def update(self, oauth_account: OAuthAccount) -> OAuthAccount:
        """
        Update existing OAuth account.
        
        Args:
            oauth_account: OAuth account entity to update
            
        Returns:
            OAuthAccount: Updated OAuth account
        """
        pass
