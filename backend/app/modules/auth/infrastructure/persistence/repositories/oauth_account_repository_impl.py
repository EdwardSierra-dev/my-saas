"""OAuth account repository implementation."""

from typing import Optional
from sqlalchemy.orm import Session

from ....domain.repositories.oauth_account_repository import OAuthAccount, OAuthAccountRepository
from ..models import OAuthAccountModel


class OAuthAccountRepositoryImpl(OAuthAccountRepository):
    """SQLAlchemy implementation of OAuthAccountRepository."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_user_and_provider(self, user_id: int, provider: str) -> Optional[OAuthAccount]:
        """Get OAuth account by user and provider."""
        model = self.db.query(OAuthAccountModel).filter(
            OAuthAccountModel.user_id == user_id,
            OAuthAccountModel.provider == provider
        ).first()
        return self._to_entity(model) if model else None
    
    def get_by_provider_user_id(self, provider: str, provider_user_id: str) -> Optional[OAuthAccount]:
        """Get OAuth account by provider and provider user ID."""
        model = self.db.query(OAuthAccountModel).filter(
            OAuthAccountModel.provider == provider,
            OAuthAccountModel.provider_user_id == provider_user_id
        ).first()
        return self._to_entity(model) if model else None
    
    def create(self, oauth_account: OAuthAccount) -> OAuthAccount:
        """Create a new OAuth account."""
        model = OAuthAccountModel(
            user_id=oauth_account.user_id,
            provider=oauth_account.provider,
            provider_user_id=oauth_account.provider_user_id,
            access_token=oauth_account.access_token,
            refresh_token=oauth_account.refresh_token,
            token_expires_at=oauth_account.token_expires_at,
            profile_data=oauth_account.profile_data
        )
        
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    def update(self, oauth_account: OAuthAccount) -> OAuthAccount:
        """Update existing OAuth account."""
        model = self.db.query(OAuthAccountModel).filter(
            OAuthAccountModel.id == oauth_account.id
        ).first()
        
        if not model:
            raise ValueError(f"OAuth account with id {oauth_account.id} not found")
        
        model.access_token = oauth_account.access_token
        model.refresh_token = oauth_account.refresh_token
        model.token_expires_at = oauth_account.token_expires_at
        model.profile_data = oauth_account.profile_data
        
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    @staticmethod
    def _to_entity(model: OAuthAccountModel) -> OAuthAccount:
        """Convert SQLAlchemy model to domain entity."""
        return OAuthAccount(
            id=model.id,
            user_id=model.user_id,
            provider=model.provider,
            provider_user_id=model.provider_user_id,
            access_token=model.access_token,
            refresh_token=model.refresh_token,
            token_expires_at=model.token_expires_at,
            profile_data=model.profile_data,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
