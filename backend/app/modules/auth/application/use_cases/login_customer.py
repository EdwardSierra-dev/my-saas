"""Login customer use case."""

from dataclasses import dataclass

from app.shared.constants.enums import UserRole
from app.shared.exceptions import ValidationError, AuthenticationError as UnauthorizedError
from ...domain.entities.user import User
from ...domain.repositories.user_repository import UserRepository
from ..services.password_service import PasswordService
from ..services.token_service import TokenService, TokenPair


@dataclass
class LoginCustomerRequest:
    """Request for customer login."""
    
    email: str
    password: str


@dataclass
class LoginCustomerResponse:
    """Response for customer login."""
    
    user: User
    tokens: TokenPair


class LoginCustomer:
    """Use case for customer login."""
    
    def __init__(
        self,
        user_repository: UserRepository,
        password_service: PasswordService,
        token_service: TokenService
    ):
        self.user_repository = user_repository
        self.password_service = password_service
        self.token_service = token_service
    
    def execute(self, request: LoginCustomerRequest) -> LoginCustomerResponse:
        """
        Execute customer login.
        
        Args:
            request: Login request data
            
        Returns:
            LoginCustomerResponse with user and tokens
            
        Raises:
            UnauthorizedError: If credentials are invalid
            ValidationError: If user is not a customer
        """
        # Find user by email
        user = self.user_repository.find_by_email(request.email)
        if not user:
            raise UnauthorizedError(
                message="Invalid email or password",
                code="INVALID_CREDENTIALS"
            )
        
        # Verify user is a customer
        if user.role != UserRole.CUSTOMER:
            raise ValidationError(
                message="This account is not a customer account",
                code="INVALID_ACCOUNT_TYPE"
            )
        
        # Check if user has a password (OAuth users don't)
        if not user.has_password():
            raise ValidationError(
                message="This account uses OAuth authentication. Please login with your OAuth provider.",
                code="OAUTH_ACCOUNT"
            )
        
        # Verify password
        if not self.password_service.verify_password(request.password, user.password_hash):
            raise UnauthorizedError(
                message="Invalid email or password",
                code="INVALID_CREDENTIALS"
            )
        
        # Check if user is active
        if not user.is_active:
            raise UnauthorizedError(
                message="Account is inactive",
                code="ACCOUNT_INACTIVE"
            )
        
        # Generate tokens
        tokens = self.token_service.create_token_pair(user)
        
        return LoginCustomerResponse(
            user=user,
            tokens=tokens
        )
