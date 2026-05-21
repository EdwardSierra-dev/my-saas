"""Customer authentication API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.shared.exceptions import ValidationError, ConflictError, AuthenticationError as UnauthorizedError
from ....application.use_cases.register_customer import (
    RegisterCustomer,
    RegisterCustomerRequest,
    RegisterCustomerOAuthRequest,
)
from ....application.use_cases.login_customer import (
    LoginCustomer,
    LoginCustomerRequest,
)
from ....application.services.token_service import TokenService
from ....application.services.password_service import PasswordService
from ....infrastructure.persistence.repositories.user_repository_impl import UserRepositoryImpl
from ....infrastructure.persistence.repositories.oauth_account_repository_impl import OAuthAccountRepositoryImpl
from ...schemas.customer import (
    RegisterCustomerSchema,
    RegisterCustomerOAuthSchema,
    LoginCustomerSchema,
    RegisterCustomerResponseSchema,
    CustomerResponseSchema,
)
from ...schemas.auth import TokenResponseSchema


router = APIRouter(prefix="/customer", tags=["customer-authentication"])


@router.post(
    "/register",
    response_model=RegisterCustomerResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer account",
    description="Register a new customer account with email and password"
)
async def register_customer(
    request: RegisterCustomerSchema,
    db: Session = Depends(get_db)
):
    """
    Register a new customer account.
    
    **Required fields:**
    - full_name: Customer full name (2-100 characters)
    - email: Valid email address
    - password: Strong password (8+ chars, uppercase, lowercase, digit, special char)
    - confirm_password: Must match password
    
    **Optional fields:**
    - preferences: List of preference categories (beauty_aesthetics, fast_food, pharmacy, specialists)
    
    **Returns:**
    - user: Created customer information
    - tokens: Access and refresh tokens for authentication
    
    **Errors:**
    - 409: Email already registered
    - 422: Validation error (invalid fields)
    """
    try:
        # Create dependencies
        user_repository = UserRepositoryImpl(db)
        oauth_account_repository = OAuthAccountRepositoryImpl(db)
        token_service = TokenService()
        password_service = PasswordService()
        
        # Create use case
        use_case = RegisterCustomer(
            user_repository=user_repository,
            oauth_account_repository=oauth_account_repository,
            password_service=password_service,
            token_service=token_service
        )
        
        # Execute use case
        use_case_request = RegisterCustomerRequest(
            full_name=request.full_name,
            email=request.email,
            password=request.password,
            confirm_password=request.confirm_password,
            preferences=[pref.value for pref in request.preferences]
        )
        
        result = use_case.execute(use_case_request)
        
        # Convert to response schema
        return RegisterCustomerResponseSchema(
            user=CustomerResponseSchema(
                id=result.user.id,
                email=result.user.email,
                name=result.user.name,
                avatar_url=result.user.avatar_url,
                is_active=result.user.is_active,
                is_verified=result.user.is_verified,
                preferences=result.preferences.categories,
                created_at=result.user.created_at.isoformat() if result.user.created_at else ""
            ),
            tokens=TokenResponseSchema(
                access_token=result.tokens.access_token,
                refresh_token=result.tokens.refresh_token,
                token_type=result.tokens.token_type,
                expires_in=result.tokens.expires_in
            )
        )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": e.code,
                "message": e.message,
                "details": e.details
            }
        )
    except ConflictError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": e.code,
                "message": e.message
            }
        )
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error during customer registration: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        )


@router.post(
    "/register/oauth",
    response_model=RegisterCustomerResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer via OAuth",
    description="Complete customer registration after OAuth authentication"
)
async def register_customer_oauth(
    request: RegisterCustomerOAuthSchema,
    db: Session = Depends(get_db)
):
    """
    Register a new customer via OAuth.
    
    **Required fields:**
    - temp_token: Temporary token from OAuth callback
    - preferences: List of preference categories
    
    **Returns:**
    - user: Created customer information
    - tokens: Access and refresh tokens for authentication
    
    **Errors:**
    - 400: Invalid temp_token
    - 409: Email already registered
    """
    try:
        # Create dependencies
        user_repository = UserRepositoryImpl(db)
        oauth_account_repository = OAuthAccountRepositoryImpl(db)
        token_service = TokenService()
        password_service = PasswordService()
        
        # Create use case
        use_case = RegisterCustomer(
            user_repository=user_repository,
            oauth_account_repository=oauth_account_repository,
            password_service=password_service,
            token_service=token_service
        )
        
        # Execute use case
        use_case_request = RegisterCustomerOAuthRequest(
            temp_token=request.temp_token,
            preferences=[pref.value for pref in request.preferences]
        )
        
        result = use_case.execute_oauth(use_case_request)
        
        # Convert to response schema
        return RegisterCustomerResponseSchema(
            user=CustomerResponseSchema(
                id=result.user.id,
                email=result.user.email,
                name=result.user.name,
                avatar_url=result.user.avatar_url,
                is_active=result.user.is_active,
                is_verified=result.user.is_verified,
                preferences=result.preferences.categories,
                created_at=result.user.created_at.isoformat() if result.user.created_at else ""
            ),
            tokens=TokenResponseSchema(
                access_token=result.tokens.access_token,
                refresh_token=result.tokens.refresh_token,
                token_type=result.tokens.token_type,
                expires_in=result.tokens.expires_in
            )
        )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": e.code,
                "message": e.message,
                "details": e.details
            }
        )
    except ConflictError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": e.code,
                "message": e.message
            }
        )
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error during OAuth customer registration: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        )


@router.post(
    "/login",
    response_model=RegisterCustomerResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Customer login",
    description="Login with email and password"
)
async def login_customer(
    request: LoginCustomerSchema,
    db: Session = Depends(get_db)
):
    """
    Customer login.
    
    **Required fields:**
    - email: Customer email address
    - password: Customer password
    
    **Returns:**
    - user: Customer information
    - tokens: Access and refresh tokens for authentication
    
    **Errors:**
    - 401: Invalid credentials
    - 422: Validation error
    """
    try:
        # Create dependencies
        user_repository = UserRepositoryImpl(db)
        token_service = TokenService()
        password_service = PasswordService()
        
        # Create use case
        use_case = LoginCustomer(
            user_repository=user_repository,
            password_service=password_service,
            token_service=token_service
        )
        
        # Execute use case
        use_case_request = LoginCustomerRequest(
            email=request.email,
            password=request.password
        )
        
        result = use_case.execute(use_case_request)
        
        # Convert to response schema
        return RegisterCustomerResponseSchema(
            user=CustomerResponseSchema(
                id=result.user.id,
                email=result.user.email,
                name=result.user.name,
                avatar_url=result.user.avatar_url,
                is_active=result.user.is_active,
                is_verified=result.user.is_verified,
                preferences=[],  # TODO: Load from database
                created_at=result.user.created_at.isoformat() if result.user.created_at else ""
            ),
            tokens=TokenResponseSchema(
                access_token=result.tokens.access_token,
                refresh_token=result.tokens.refresh_token,
                token_type=result.tokens.token_type,
                expires_in=result.tokens.expires_in
            )
        )
        
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": e.code,
                "message": e.message
            }
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": e.code,
                "message": e.message,
                "details": e.details
            }
        )
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error during customer login: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        )


@router.get(
    "/health",
    summary="Health check",
    description="Check if the customer authentication service is running"
)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "customer-authentication",
        "version": "1.0.0"
    }
