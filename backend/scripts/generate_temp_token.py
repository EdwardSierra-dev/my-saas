"""Script to generate temporary OAuth token for testing."""

import sys
sys.path.insert(0, '.')

from app.modules.auth.application.services.token_service import TokenService, OAuthUserData


def generate_temp_token(
    email: str = "test@example.com",
    name: str = "Test User",
    provider: str = "google"
):
    """
    Generate a temporary OAuth token for testing.
    
    Args:
        email: User email
        name: User name
        provider: OAuth provider (google, microsoft, linkedin)
    """
    token_service = TokenService()
    
    oauth_data = OAuthUserData(
        provider=provider,
        provider_user_id="test_user_123",
        email=email,
        name=name,
        picture=None
    )
    
    temp_token = token_service.create_temp_token(oauth_data)
    
    print("\n" + "="*80)
    print("TEMPORARY OAUTH TOKEN GENERATED")
    print("="*80)
    print(f"\nProvider: {provider}")
    print(f"Email: {email}")
    print(f"Name: {name}")
    print(f"\nToken (valid for 10 minutes):")
    print("-"*80)
    print(temp_token)
    print("-"*80)
    print("\nUse this token in the 'temp_token' field when calling:")
    print("POST /api/v1/auth/register/business")
    print("\nExample curl command:")
    print("-"*80)
    print(f'''
curl -X POST "http://localhost:8000/api/v1/auth/register/business" \\
  -H "Content-Type: application/json" \\
  -d '{{
    "temp_token": "{temp_token}",
    "name": "Test Barbershop",
    "business_type": "barbershop",
    "city": "Bogotá",
    "department": "Cundinamarca",
    "phone": "3001234567",
    "password": "SecurePass123!",
    "confirm_password": "SecurePass123!",
    "address": "Calle 123 #45-67"
  }}'
''')
    print("="*80 + "\n")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate temporary OAuth token for testing")
    parser.add_argument("--email", default="test@example.com", help="User email")
    parser.add_argument("--name", default="Test User", help="User name")
    parser.add_argument("--provider", default="google", choices=["google", "microsoft", "linkedin"], help="OAuth provider")
    
    args = parser.parse_args()
    
    generate_temp_token(
        email=args.email,
        name=args.name,
        provider=args.provider
    )
