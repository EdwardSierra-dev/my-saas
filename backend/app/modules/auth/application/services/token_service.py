"""Token service for JWT management."""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from dataclasses import dataclass

from app.core.security import create_access_token, create_refresh_token, decode_token
from ...domain.entities.user import User


@dataclass
class TokenPair:
    """Token pair (access + refresh)."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes in seconds


@dataclass
class OAuthUserData:
    """OAuth user data from provider."""
    provider: str
    provider_user_id: str
    email: str
    name: str
    picture: Optional[str] = None


class TokenService:
    """Service for JWT token management."""
    
    def create_token_pair(self, user: User) -> TokenPair:
        """
        Create access and refresh token pair for user.
        
        Args:
            user: User entity
            
        Returns:
            TokenPair: Access and refresh tokens
        """
        # Create token payload
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "tenant_id": user.tenant_id
        }
        
        # Generate tokens
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=900  # 15 minutes
        )
    
    def create_temp_token(self, oauth_data: OAuthUserData) -> str:
        """
        Create temporary token for OAuth flow.
        
        Args:
            oauth_data: OAuth user data
            
        Returns:
            str: Temporary token (valid for 10 minutes)
        """
        token_data = {
            "type": "temp",
            "provider": oauth_data.provider,
            "provider_user_id": oauth_data.provider_user_id,
            "email": oauth_data.email,
            "name": oauth_data.name,
            "picture": oauth_data.picture
        }
        
        # Create token with 10-minute expiration
        expires_delta = timedelta(minutes=10)
        return create_access_token(token_data, expires_delta)
    
    def verify_temp_token(self, token: str) -> Optional[OAuthUserData]:
        """
        Verify temporary token and extract OAuth data.
        
        Args:
            token: Temporary token (JWT or base64 for development)
            
        Returns:
            Optional[OAuthUserData]: OAuth data if valid, None otherwise
        """
        # Try JWT first
        payload = decode_token(token)
        
        if payload and payload.get("type") == "temp":
            return OAuthUserData(
                provider=payload.get("provider"),
                provider_user_id=payload.get("provider_user_id"),
                email=payload.get("email"),
                name=payload.get("name"),
                picture=payload.get("picture")
            )
        
        # For development: try base64 decoding (simulated OAuth)
        try:
            import base64
            import json
            decoded = base64.b64decode(token).decode('utf-8')
            data = json.loads(decoded)
            
            # Validate required fields
            if all(k in data for k in ['provider', 'email', 'name']):
                return OAuthUserData(
                    provider=data.get('provider'),
                    provider_user_id=data.get('email'),  # Use email as ID for simulated OAuth
                    email=data.get('email'),
                    name=data.get('name'),
                    picture=data.get('picture')
                )
        except Exception:
            pass
        
        return None
    
    def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify access token.
        
        Args:
            token: Access token
            
        Returns:
            Optional[Dict[str, Any]]: Token payload if valid, None otherwise
        """
        payload = decode_token(token)
        
        if not payload or payload.get("type") == "temp":
            return None
        
        return payload
    
    def get_user_id_from_token(self, token: str) -> Optional[int]:
        """
        Extract user ID from token.
        
        Args:
            token: JWT token
            
        Returns:
            Optional[int]: User ID if valid, None otherwise
        """
        payload = self.verify_access_token(token)
        
        if not payload:
            return None
        
        try:
            return int(payload.get("sub"))
        except (ValueError, TypeError):
            return None
