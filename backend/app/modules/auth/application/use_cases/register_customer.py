"""Register customer use case."""

from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

from app.shared.constants.enums import UserRole, OAuthProvider
from app.shared.exceptions import ValidationError, ConflictError
from ...domain.entities.user import User
from ...domain.entities.customer_preferences import CustomerPreferences
from ...domain.repositories.user_repository import UserRepository
from ...domain.repositories.oauth_account_repository import OAuthAccountRepository
from ..services.password_service import PasswordService
from ..services.token_service import TokenService, TokenPair


@dataclass
class RegisterCustomerRequest:
    """Request for customer registration."""
    
    full_name: str
    email: str
    password: str
    confirm_password: str
    preferences: List[str]


@dataclass
class RegisterCustomerOAuthRequest:
    """Request for customer registration via OAuth."""
    
    temp_token: str
    preferences: List[str]


@dataclass
class RegisterCustomerResponse:
    """Response for customer registration."""
    
    user: User
    preferences: CustomerPreferences
    tokens: TokenPair


class RegisterCustomer:
    """Use case for registering a new customer."""
    
    def __init__(
        self,
        user_repository: UserRepository,
        oauth_account_repository: OAuthAccountRepository,
        password_service: PasswordService,
        token_service: TokenService
    ):
        self.user_repository = user_repository
        self.oauth_account_repository = oauth_account_repository
        self.password_service = password_service
        self.token_service = token_service
    
    def execute(self, request: RegisterCustomerRequest) -> RegisterCustomerResponse:
        """
        Execute customer registration.
        
        Args:
            request: Registration request data
            
        Returns:
            RegisterCustomerResponse with user, preferences, and tokens
            
        Raises:
            ValidationError: If validation fails
            ConflictError: If email already exists
        """
        # Validate passwords match
        if request.password != request.confirm_password:
            raise ValidationError(
                message="Passwords do not match",
                code="PASSWORDS_MISMATCH",
                details={"field": "confirm_password"}
            )
        
        # Check if email already exists
        existing_user = self.user_repository.find_by_email(request.email)
        if existing_user:
            raise ConflictError(
                message=f"Email {request.email} is already registered",
                code="EMAIL_EXISTS"
            )
        
        # Hash password
        password_hash = self.password_service.hash_password(request.password)
        
        # Create user entity
        user = User(
            id=None,
            email=request.email,
            name=request.full_name,
            role=UserRole.CUSTOMER,
            password_hash=password_hash,
            is_active=True,
            is_verified=False,
            tenant_id=None,  # Customers don't belong to a tenant
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save user
        created_user = self.user_repository.save(user)
        
        # Create preferences
        preferences = CustomerPreferences(
            id=None,
            user_id=created_user.id,
            categories=request.preferences,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # TODO: Save preferences to database when repository is implemented
        
        # Generate tokens
        tokens = self.token_service.create_token_pair(created_user)
        
        return RegisterCustomerResponse(
            user=created_user,
            preferences=preferences,
            tokens=tokens
        )
    
    def execute_oauth(self, request: RegisterCustomerOAuthRequest) -> RegisterCustomerResponse:
        """
        Execute customer registration via OAuth.
        
        Args:
            request: OAuth registration request data
            
        Returns:
            RegisterCustomerResponse with user, preferences, and tokens
            
        Raises:
            ValidationError: If temp token is invalid
            ConflictError: If email already exists
        """
        # Verify temp token and get OAuth data
        oauth_data = self.token_service.verify_temp_token(request.temp_token)
        if not oauth_data:
            raise ValidationError(
                message="Invalid or expired temporary token",
                code="INVALID_TEMP_TOKEN"
            )
        
        email = oauth_data.get("email")
        name = oauth_data.get("name")
        provider = oauth_data.get("provider")
        provider_user_id = oauth_data.get("provider_user_id")
        
        # Check if email already exists
        existing_user = self.user_repository.find_by_email(email)
        if existing_user:
            raise ConflictError(
                message=f"Email {email} is already registered",
                code="EMAIL_EXISTS"
            )
        
        # Create user entity (no password for OAuth users)
        user = User(
            id=None,
            email=email,
            name=name,
            role=UserRole.CUSTOMER,
            password_hash=None,  # OAuth users don't have passwords
            is_active=True,
            is_verified=True,  # OAuth users are pre-verified
            tenant_id=None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save user
        created_user = self.user_repository.save(user)
        
        # Save OAuth account link
        self.oauth_account_repository.create(
            user_id=created_user.id,
            provider=OAuthProvider(provider),
            provider_user_id=provider_user_id,
            email=email
        )
        
        # Create preferences
        preferences = CustomerPreferences(
            id=None,
            user_id=created_user.id,
            categories=request.preferences,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # TODO: Save preferences to database when repository is implemented
        
        # Generate tokens
        tokens = self.token_service.create_token_pair(created_user)
        
        return RegisterCustomerResponse(
            user=created_user,
            preferences=preferences,
            tokens=tokens
        )
