"""Password service for validation and hashing."""

import re
from typing import List, Tuple

from app.core.security import hash_password, verify_password


class PasswordService:
    """Service for password validation and hashing."""
    
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, List[str]]:
        """
        Validate password strength.
        
        Password must:
        - Be at least 8 characters long
        - Contain at least one uppercase letter
        - Contain at least one lowercase letter
        - Contain at least one digit
        - Contain at least one special character
        
        Args:
            password: Password to validate
            
        Returns:
            Tuple[bool, List[str]]: (is_valid, list of error messages)
        """
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one digit")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash password using bcrypt.
        
        Bcrypt has a maximum password length of 72 bytes.
        Passwords longer than this will be truncated.
        
        Args:
            password: Plain text password
            
        Returns:
            str: Hashed password
        """
        # Truncate password to 72 bytes for bcrypt compatibility
        password_bytes = password.encode('utf-8')[:72]
        password_truncated = password_bytes.decode('utf-8', errors='ignore')
        return hash_password(password_truncated)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify password against hash.
        
        Args:
            plain_password: Plain text password
            hashed_password: Hashed password
            
        Returns:
            bool: True if password matches
        """
        # Truncate password to 72 bytes for bcrypt compatibility
        password_bytes = plain_password.encode('utf-8')[:72]
        password_truncated = password_bytes.decode('utf-8', errors='ignore')
        return verify_password(password_truncated, hashed_password)
