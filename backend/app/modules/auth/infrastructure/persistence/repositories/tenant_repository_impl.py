"""Tenant repository implementation."""

from typing import Optional, List
from sqlalchemy.orm import Session

from ....domain.entities.tenant import Tenant
from ....domain.repositories.tenant_repository import TenantRepository
from ..models import TenantModel
from app.shared.constants.enums import BusinessType


class TenantRepositoryImpl(TenantRepository):
    """SQLAlchemy implementation of TenantRepository."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, tenant_id: int) -> Optional[Tenant]:
        """Get tenant by ID."""
        model = self.db.query(TenantModel).filter(
            TenantModel.id == tenant_id,
            TenantModel.deleted_at.is_(None)
        ).first()
        return self._to_entity(model) if model else None
    
    def find_by_id(self, tenant_id: int) -> Optional[Tenant]:
        """Find tenant by ID (alias for get_by_id)."""
        return self.get_by_id(tenant_id)
    
    def get_by_slug(self, slug: str) -> Optional[Tenant]:
        """Get tenant by slug."""
        model = self.db.query(TenantModel).filter(
            TenantModel.slug == slug,
            TenantModel.deleted_at.is_(None)
        ).first()
        return self._to_entity(model) if model else None
    
    def find_all(self) -> List[Tenant]:
        """Get all tenants."""
        models = self.db.query(TenantModel).filter(
            TenantModel.deleted_at.is_(None)
        ).all()
        return [self._to_entity(model) for model in models]
    
    def create(self, tenant: Tenant) -> Tenant:
        """Create a new tenant."""
        model = TenantModel(
            name=tenant.name,
            business_type=tenant.business_type.value if isinstance(tenant.business_type, BusinessType) else tenant.business_type,
            slug=tenant.slug,
            email=tenant.email,
            phone=tenant.phone,
            address=tenant.address,
            city=tenant.city,
            department=tenant.department,
            country=tenant.country,
            timezone=tenant.timezone,
            currency=tenant.currency,
            logo_url=tenant.logo_url,
            is_active=tenant.is_active
        )
        
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    def update(self, tenant: Tenant) -> Tenant:
        """Update existing tenant."""
        model = self.db.query(TenantModel).filter(TenantModel.id == tenant.id).first()
        
        if not model:
            raise ValueError(f"Tenant with id {tenant.id} not found")
        
        model.name = tenant.name
        model.business_type = tenant.business_type.value if isinstance(tenant.business_type, BusinessType) else tenant.business_type
        model.email = tenant.email
        model.phone = tenant.phone
        model.address = tenant.address
        model.city = tenant.city
        model.department = tenant.department
        model.logo_url = tenant.logo_url
        model.is_active = tenant.is_active
        
        self.db.commit()
        self.db.refresh(model)
        
        return self._to_entity(model)
    
    @staticmethod
    def _to_entity(model: TenantModel) -> Tenant:
        """Convert SQLAlchemy model to domain entity."""
        return Tenant(
            id=model.id,
            name=model.name,
            business_type=BusinessType(model.business_type),
            slug=model.slug,
            email=model.email,
            phone=model.phone,
            address=model.address,
            city=model.city,
            department=model.department,
            country=model.country,
            timezone=model.timezone,
            currency=model.currency,
            logo_url=model.logo_url,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
