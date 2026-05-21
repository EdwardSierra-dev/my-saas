"""Base exception classes."""

from typing import Optional, Dict, Any


class AppException(Exception):
    """Base exception for all application exceptions."""
    
    def __init__(
        self,
        message: str,
        code: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppException):
    """Exception raised when a resource is not found."""
    
    def __init__(self, message: str, code: str = "NOT_FOUND", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code, 404, details)


class ValidationError(AppException):
    """Exception raised when validation fails."""
    
    def __init__(self, message: str, code: str = "VALIDATION_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code, 422, details)


class AuthenticationError(AppException):
    """Exception raised when authentication fails."""
    
    def __init__(self, message: str, code: str = "AUTHENTICATION_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code, 401, details)


class AuthorizationError(AppException):
    """Exception raised when authorization fails."""
    
    def __init__(self, message: str, code: str = "AUTHORIZATION_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code, 403, details)


class ConflictError(AppException):
    """Exception raised when there's a conflict (e.g., duplicate resource)."""
    
    def __init__(self, message: str, code: str = "CONFLICT_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code, 409, details)


# Alias for AuthenticationError
class UnauthorizedError(AuthenticationError):
    """Exception raised when authentication fails (alias for AuthenticationError)."""
    pass
