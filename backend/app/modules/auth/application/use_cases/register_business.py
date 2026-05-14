"""Register business use case."""

import re
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

from ...domain.entities.user import User
from ...domain.entities.tenant import Tenant
from ...domain.repositories.user_repository import UserRepository
from ...domain.repositories.tenant_repository import TenantRepository
from ...domain.repositories.oauth_account_repository import OAuthAccount, OAuthAccountRepository
from ...domain.value_objects.email import Email
from ...domain.value_objects.phone import Phone
from ..services.token_service import TokenService, TokenPair, OAuthUserData
from ..services.password_service import PasswordService
from app.shared.constants.enums import UserRole, BusinessType, ColombiaDepartment
from app.shared.exceptions import ConflictError, ValidationError


@dataclass
class RegisterBusinessRequest:
    """Request to register a new business."""
    
    temp_token: str
    name: str
    business_type: str
    city: str
    department: str
    phone: str
    password: str
    confirm_password: str
    address: Optional[str] = None


@dataclass
class RegisterBusinessResponse:
    """Response from business registration."""
    
    user: User
    tenant: Tenant
    tokens: TokenPair


class RegisterBusiness:
    """Use case for registering a new business account."""
    
    def __init__(
        self,
        user_repository: UserRepository,
        tenant_repository: TenantRepository,
        oauth_account_repository: OAuthAccountRepository,
        token_service: TokenService,
        password_service: PasswordService
    ):
        self.user_repository = user_repository
        self.tenant_repository = tenant_repository
        self.oauth_account_repository = oauth_account_repository
        self.token_service = token_service
        self.password_service = password_service
    
    def execute(self, request: RegisterBusinessRequest) -> RegisterBusinessResponse:
        """
        Execute the business registration use case.
        
        Args:
            request: Registration request
            
        Returns:
            RegisterBusinessResponse: Registration response with user, tenant, and tokens
            
        Raises:
            ValidationError: If validation fails
            ConflictError: If email already exists
        """
        # 1. Validate and extract OAuth data from temp token
        oauth_data = self._validate_temp_token(request.temp_token)
        
        # 2. Validate all input fields
        self._validate_request(request)
        
        # 3. Check if user already exists
        existing_user = self.user_repository.get_by_email(oauth_data.email)
        if existing_user:
            raise ConflictError(
                f"Email {oauth_data.email} is already registered",
                code="EMAIL_EXISTS"
            )
        
        # 4. Create tenant (business)
        tenant = self._create_tenant(request, oauth_data)
        
        # 5. Create user
        user = self._create_user(request, oauth_data, tenant.id)
        
        # 6. Link OAuth account
        self._create_oauth_account(user.id, oauth_data)
        
        # 7. Generate JWT tokens
        tokens = self.token_service.create_token_pair(user)
        
        return RegisterBusinessResponse(
            user=user,
            tenant=tenant,
            tokens=tokens
        )
    
    def _validate_temp_token(self, temp_token: str) -> OAuthUserData:
        """Validate temporary token and extract OAuth data."""
        oauth_data = self.token_service.verify_temp_token(temp_token)
        
        if not oauth_data:
            raise ValidationError(
                "Invalid or expired temporary token",
                code="INVALID_TEMP_TOKEN"
            )
        
        return oauth_data
    
    def _validate_request(self, request: RegisterBusinessRequest) -> None:
        """Validate registration request."""
        errors = {}
        
        # Validate name
        if not request.name or len(request.name) < 2:
            errors["name"] = "Business name must be at least 2 characters"
        elif len(request.name) > 100:
            errors["name"] = "Business name must not exceed 100 characters"
        
        # Validate business type
        try:
            BusinessType(request.business_type)
        except ValueError:
            valid_types = [bt.value for bt in BusinessType]
            errors["business_type"] = f"Invalid business type. Must be one of: {', '.join(valid_types)}"
        
        # Validate city
        if not request.city or len(request.city) < 2:
            errors["city"] = "City is required and must be at least 2 characters"
        
        # Validate department
        try:
            ColombiaDepartment(request.department)
        except ValueError:
            valid_depts = [dept.value for dept in ColombiaDepartment]
            errors["department"] = f"Invalid department. Must be one of the 32 Colombian departments"
        
        # Validate phone
        try:
            Phone(request.phone)
        except ValueError as e:
            errors["phone"] = str(e)
        
        # Validate password
        is_valid, password_errors = self.password_service.validate_password(request.password)
        if not is_valid:
            errors["password"] = "; ".join(password_errors)
        
        # Validate password confirmation
        if request.password != request.confirm_password:
            errors["confirm_password"] = "Passwords do not match"
        
        # Validate address (optional but check length if provided)
        if request.address and len(request.address) > 500:
            errors["address"] = "Address must not exceed 500 characters"
        
        if errors:
            raise ValidationError(
                "Validation failed",
                code="VALIDATION_ERROR",
                details=errors
            )
    
    def _create_tenant(self, request: RegisterBusinessRequest, oauth_data: OAuthUserData) -> Tenant:
        """Create tenant (business) entity."""
        # Generate slug from business name
        slug = self._generate_slug(request.name)
        
        # Ensure slug is unique
        existing_tenant = self.tenant_repository.get_by_slug(slug)
        if existing_tenant:
            # Add timestamp to make it unique
            slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        
        tenant = Tenant(
            id=None,
            name=request.name,
            business_type=BusinessType(request.business_type),
            slug=slug,
            email=oauth_data.email,
            phone=request.phone,
            address=request.address,
            city=request.city,
            department=request.department,
            country="Colombia",
            timezone="America/Bogota",
            currency="COP",
            logo_url=oauth_data.picture,
            is_active=True
        )
        
        return self.tenant_repository.create(tenant)
    
    def _create_user(self, request: RegisterBusinessRequest, oauth_data: OAuthUserData, tenant_id: int) -> User:
        """Create user entity."""
        # Hash password
        password_hash = self.password_service.hash_password(request.password)
        
        user = User(
            id=None,
            email=oauth_data.email,
            name=request.name,
            role=UserRole.BUSINESS_OWNER,
            phone=request.phone,
            password_hash=password_hash,
            avatar_url=oauth_data.picture,
            is_active=True,
            is_verified=True,  # Verified via OAuth
            tenant_id=tenant_id
        )
        
        return self.user_repository.create(user)
    
    def _create_oauth_account(self, user_id: int, oauth_data: OAuthUserData) -> OAuthAccount:
        """Create OAuth account link."""
        oauth_account = OAuthAccount(
            id=None,
            user_id=user_id,
            provider=oauth_data.provider,
            provider_user_id=oauth_data.provider_user_id,
            profile_data={
                "email": oauth_data.email,
                "name": oauth_data.name,
                "picture": oauth_data.picture
            }
        )
        
        return self.oauth_account_repository.create(oauth_account)
    
    @staticmethod
    def _generate_slug(name: str) -> str:
        """
        Generate URL-friendly slug from business name.
        
        Args:
            name: Business name
            
        Returns:
            str: URL-friendly slug
        """
        # Convert to lowercase
        slug = name.lower()
        
        # Replace spaces and special characters with hyphens
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        
        # Limit length
        return slug[:100]
