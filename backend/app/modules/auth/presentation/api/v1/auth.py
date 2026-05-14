"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.shared.exceptions import ValidationError, ConflictError
from ....application.use_cases.register_business import (
    RegisterBusiness,
    RegisterBusinessRequest,
)
from ....application.services.token_service import TokenService
from ....application.services.password_service import PasswordService
from ....infrastructure.persistence.repositories.user_repository_impl import UserRepositoryImpl
from ....infrastructure.persistence.repositories.tenant_repository_impl import TenantRepositoryImpl
from ....infrastructure.persistence.repositories.oauth_account_repository_impl import OAuthAccountRepositoryImpl
from ...schemas.auth import (
    RegisterBusinessSchema,
    RegisterBusinessResponseSchema,
    TokenResponseSchema,
)
from ...schemas.user import UserResponseSchema
from ...schemas.tenant import TenantResponseSchema


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register/business",
    response_model=RegisterBusinessResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new business account",
    description="Register a new business account using OAuth provider data and complete registration form"
)
async def register_business(
    request: RegisterBusinessSchema,
    db: Session = Depends(get_db)
):
    """
    Register a new business account.
    
    This endpoint completes the business registration after OAuth authentication.
    
    **Required fields:**
    - temp_token: Temporary token from OAuth callback
    - name: Business name (2-100 characters)
    - business_type: One of: barbershop, spa, local_store, restaurant, pharmacy, independent_worker
    - city: City name
    - department: Colombian department
    - phone: 10-digit Colombian phone number
    - password: Strong password (8+ chars, uppercase, lowercase, digit, special char)
    - confirm_password: Must match password
    
    **Optional fields:**
    - address: Business address (recommended for on-site services)
    
    **Returns:**
    - user: Created user information
    - tenant: Created business (tenant) information
    - tokens: Access and refresh tokens for authentication
    
    **Errors:**
    - 400: Invalid temp_token
    - 409: Email already registered
    - 422: Validation error (invalid fields)
    """
    try:
        # Log the incoming request for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Received registration request: {request.model_dump()}")
        
        # Create dependencies
        user_repository = UserRepositoryImpl(db)
        tenant_repository = TenantRepositoryImpl(db)
        oauth_account_repository = OAuthAccountRepositoryImpl(db)
        token_service = TokenService()
        password_service = PasswordService()
        
        # Create use case
        use_case = RegisterBusiness(
            user_repository=user_repository,
            tenant_repository=tenant_repository,
            oauth_account_repository=oauth_account_repository,
            token_service=token_service,
            password_service=password_service
        )
        
        # Execute use case
        use_case_request = RegisterBusinessRequest(
            temp_token=request.temp_token,
            name=request.name,
            business_type=request.business_type,
            city=request.city,
            department=request.department,
            phone=request.phone,
            password=request.password,
            confirm_password=request.confirm_password,
            address=request.address
        )
        
        result = use_case.execute(use_case_request)
        
        # Convert to response schema
        return RegisterBusinessResponseSchema(
            user=UserResponseSchema.model_validate(result.user),
            tenant=TenantResponseSchema.model_validate(result.tenant),
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
        import traceback
        logger.error(f"Error during registration: {str(e)}")
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
    description="Check if the authentication service is running"
)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "authentication",
        "version": "1.0.0"
    }


@router.post(
    "/debug/register",
    summary="Debug registration data",
    description="Debug endpoint to see what data is being received"
)
async def debug_register(request: dict):
    """Debug endpoint to see raw request data."""
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Received raw data: {request}")
    return {
        "received_data": request,
        "data_types": {k: type(v).__name__ for k, v in request.items()}
    }
