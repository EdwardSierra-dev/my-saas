"""Repository interfaces for authentication domain."""

from .user_repository import UserRepository
from .tenant_repository import TenantRepository
from .oauth_account_repository import OAuthAccountRepository

__all__ = ["UserRepository", "TenantRepository", "OAuthAccountRepository"]
