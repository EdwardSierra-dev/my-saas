"""Custom exceptions for the application."""

from .base import (
    AppException,
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    UnauthorizedError,
)

__all__ = [
    "AppException",
    "NotFoundError",
    "ValidationError",
    "AuthenticationError",
    "AuthorizationError",
    "ConflictError",
    "UnauthorizedError",
]
