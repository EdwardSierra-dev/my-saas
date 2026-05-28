"""SQLAlchemy models for customer features (favorites, purchases, reviews)."""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CustomerFavoriteModel(Base):
    """Customer favorites database model."""
    
    __tablename__ = "customer_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    added_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Unique constraint: one customer can favorite a business only once
    __table_args__ = (
        {"schema": None},
    )
    
    def __repr__(self):
        return f"<CustomerFavorite(id={self.id}, customer_id={self.customer_id}, business_id={self.business_id})>"


class CustomerPurchaseModel(Base):
    """Customer purchase history database model."""
    
    __tablename__ = "customer_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    product_name = Column(String(255), nullable=False)
    purchase_date = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="pending", index=True)  # pending, completed, cancelled, delivered
    total_amount = Column(Integer, nullable=False)  # Amount in cents
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<CustomerPurchase(id={self.id}, customer_id={self.customer_id}, status={self.status})>"


class CustomerReviewModel(Base):
    """Customer review history database model."""
    
    __tablename__ = "customer_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    product_name = Column(String(255), nullable=True)
    comment = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    review_date = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<CustomerReview(id={self.id}, customer_id={self.customer_id}, rating={self.rating})>"


class CustomerPreferenceModel(Base):
    """Customer preferences database model."""
    
    __tablename__ = "customer_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True, unique=True)
    categories = Column(Text, nullable=False)  # Comma-separated list of categories
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<CustomerPreference(id={self.id}, customer_id={self.customer_id})>"
