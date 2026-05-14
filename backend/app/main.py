"""Main FastAPI application."""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.shared.exceptions import AppException
from app.modules.auth.presentation.api.v1.auth import router as auth_router


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Modular SaaS Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    import logging
    logger = logging.getLogger(__name__)
    
    # Log the full error for debugging
    logger.error(f"Validation error: {exc.errors()}")
    
    try:
        body = await request.body()
        logger.error(f"Request body: {body.decode()}")
    except:
        logger.error("Could not read request body")
    
    errors = {}
    error_list = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        errors[field] = error["msg"]
        error_list.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    # Print to console as well
    print(f"VALIDATION ERROR: {error_list}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Validation failed",
                "details": errors,
                "raw_errors": error_list if settings.DEBUG else []
            }
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "details": {"error": str(exc)} if settings.DEBUG else {}
            }
        }
    )


# Include routers
app.include_router(auth_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Modular SaaS Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/auth/health"
    }


# Health check endpoint
@app.get("/health", tags=["health"])
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
