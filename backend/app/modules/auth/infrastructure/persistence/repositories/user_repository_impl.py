"""User repository implementation."""

from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime

from ....domain.entities.user import User
from ....domain.repositories.user_repository import UserRepository
from ..models import UserModel
from app.shared.constants.enums import UserRole


class UserRepositoryImpl(UserRepository):
    """SQLAlchemy implementation of UserRepository."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        model = self.db.query(UserModel).filter(
            UserModel.id == user_id,
            UserModel.deleted_at.is_(None)
        ).first()
        return self._to_entity(model) if model else None
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        model = self.db.query(UserModel).filter(
            UserModel.email == email,
            UserModel.deleted_at.is_(None)
        ).first()
        return self._to_entity(model) if model else None
    
    def create(self, user: User) -> User:
        """Create a new user."""
        model = UserModel(
            email=user.email,
            name=user.name,
            role=user.role.value if isinstance(user.role, UserRole) else user.role,
            password_hash=user.password_hash,
            phone=user.phone,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            is_verified=user.is_verified,
            tenant_id=user.tenant_id
        )
        
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    def update(self, user: User) -> User:
        """Update existing user."""
        model = self.db.query(UserModel).filter(UserModel.id == user.id).first()
        
        if not model:
            raise ValueError(f"User with id {user.id} not found")
        
        model.name = user.name
        model.role = user.role.value if isinstance(user.role, UserRole) else user.role
        model.phone = user.phone
        model.avatar_url = user.avatar_url
        model.is_active = user.is_active
        model.is_verified = user.is_verified
        model.tenant_id = user.tenant_id
        
        if user.password_hash:
            model.password_hash = user.password_hash
        
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    def list_by_tenant(self, tenant_id: int, skip: int = 0, limit: int = 100) -> List[User]:
        """List all users for a tenant."""
        models = self.db.query(UserModel).filter(
            UserModel.tenant_id == tenant_id,
            UserModel.deleted_at.is_(None)
        ).offset(skip).limit(limit).all()
        
        return [self._to_entity(m) for m in models]
    
    def delete(self, user_id: int) -> bool:
        """Delete user (soft delete)."""
        model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        
        if not model:
            return False
        
        model.deleted_at = datetime.utcnow()
        model.is_active = False
        
        self.db.commit()
        return True
    
    @staticmethod
    def _to_entity(model: UserModel) -> User:
        """Convert SQLAlchemy model to domain entity."""
        return User(
            id=model.id,
            email=model.email,
            name=model.name,
            role=UserRole(model.role),
            phone=model.phone,
            password_hash=model.password_hash,
            avatar_url=model.avatar_url,
            is_active=model.is_active,
            is_verified=model.is_verified,
            tenant_id=model.tenant_id,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
