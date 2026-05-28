"""add customer features tables

Revision ID: customer_features_001
Revises: bccdb27a8106
Create Date: 2024-05-26 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'customer_features_001'
down_revision = 'bccdb27a8106'
branch_labels = None
depends_on = None


def upgrade():
    # Create customer_preferences table
    op.create_table(
        'customer_preferences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('categories', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('customer_id')
    )
    op.create_index(op.f('ix_customer_preferences_customer_id'), 'customer_preferences', ['customer_id'], unique=False)

    # Create customer_favorites table
    op.create_table(
        'customer_favorites',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('business_id', sa.Integer(), nullable=False),
        sa.Column('added_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['business_id'], ['tenants.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('customer_id', 'business_id', name='uq_customer_business_favorite')
    )
    op.create_index(op.f('ix_customer_favorites_customer_id'), 'customer_favorites', ['customer_id'], unique=False)
    op.create_index(op.f('ix_customer_favorites_business_id'), 'customer_favorites', ['business_id'], unique=False)

    # Create customer_purchases table
    op.create_table(
        'customer_purchases',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('business_id', sa.Integer(), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=False),
        sa.Column('purchase_date', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('total_amount', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['business_id'], ['tenants.id'], ondelete='CASCADE')
    )
    op.create_index(op.f('ix_customer_purchases_customer_id'), 'customer_purchases', ['customer_id'], unique=False)
    op.create_index(op.f('ix_customer_purchases_business_id'), 'customer_purchases', ['business_id'], unique=False)
    op.create_index(op.f('ix_customer_purchases_purchase_date'), 'customer_purchases', ['purchase_date'], unique=False)
    op.create_index(op.f('ix_customer_purchases_status'), 'customer_purchases', ['status'], unique=False)

    # Create customer_reviews table
    op.create_table(
        'customer_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('business_id', sa.Integer(), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=True),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('review_date', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['business_id'], ['tenants.id'], ondelete='CASCADE')
    )
    op.create_index(op.f('ix_customer_reviews_customer_id'), 'customer_reviews', ['customer_id'], unique=False)
    op.create_index(op.f('ix_customer_reviews_business_id'), 'customer_reviews', ['business_id'], unique=False)
    op.create_index(op.f('ix_customer_reviews_review_date'), 'customer_reviews', ['review_date'], unique=False)


def downgrade():
    # Drop tables in reverse order
    op.drop_index(op.f('ix_customer_reviews_review_date'), table_name='customer_reviews')
    op.drop_index(op.f('ix_customer_reviews_business_id'), table_name='customer_reviews')
    op.drop_index(op.f('ix_customer_reviews_customer_id'), table_name='customer_reviews')
    op.drop_table('customer_reviews')

    op.drop_index(op.f('ix_customer_purchases_status'), table_name='customer_purchases')
    op.drop_index(op.f('ix_customer_purchases_purchase_date'), table_name='customer_purchases')
    op.drop_index(op.f('ix_customer_purchases_business_id'), table_name='customer_purchases')
    op.drop_index(op.f('ix_customer_purchases_customer_id'), table_name='customer_purchases')
    op.drop_table('customer_purchases')

    op.drop_index(op.f('ix_customer_favorites_business_id'), table_name='customer_favorites')
    op.drop_index(op.f('ix_customer_favorites_customer_id'), table_name='customer_favorites')
    op.drop_table('customer_favorites')

    op.drop_index(op.f('ix_customer_preferences_customer_id'), table_name='customer_preferences')
    op.drop_table('customer_preferences')
