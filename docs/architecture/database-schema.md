# Database Schema Design

## Overview

This document describes the database schema for the Modular SaaS Platform. The schema is designed to support multi-tenancy, modularity, and scalability.

## Multi-Tenancy Strategy

**Approach**: Shared Database, Shared Schema with Row-Level Security

- All tenants share the same database and tables
- Each row has a `tenant_id` column for isolation
- PostgreSQL Row-Level Security (RLS) enforces data isolation
- Application layer also enforces tenant filtering

## Core Tables

### users

Stores all user accounts (business owners, customers, admins).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'business_owner', 'customer', 'admin', 'staff'
    password_hash VARCHAR(255), -- NULL for OAuth-only users
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    tenant_id INTEGER REFERENCES tenants(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT check_role CHECK (role IN ('super_admin', 'business_owner', 'business_staff', 'customer'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);
```

### tenants

Represents business accounts (each business is a tenant).

```sql
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    department VARCHAR(100), -- State/Province
    country VARCHAR(100) DEFAULT 'Colombia',
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    currency VARCHAR(3) DEFAULT 'COP',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    enabled_modules JSONB DEFAULT '[]', -- Array of enabled module names
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT check_business_type CHECK (business_type IN (
        'barbershop', 'spa', 'local_store', 'restaurant', 
        'pharmacy', 'independent_worker', 'other'
    ))
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_business_type ON tenants(business_type);
```

### oauth_accounts

Links users to their OAuth provider accounts.

```sql
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'microsoft', 'linkedin'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    profile_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON oauth_accounts(provider);
```

### refresh_tokens

Stores refresh tokens for JWT authentication.

```sql
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_expires_at CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

### permissions

Defines available permissions in the system.

```sql
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'read:inventory', 'write:orders'
    description TEXT,
    module VARCHAR(50) NOT NULL, -- e.g., 'inventory', 'orders'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_module ON permissions(module);
```

### role_permissions

Maps roles to permissions.

```sql
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(role, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role);
```

## Module Tables

### Business Profile Module

#### business_profiles

Extended business information (one-to-one with tenants).

```sql
CREATE TABLE business_profiles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tagline VARCHAR(255),
    about TEXT,
    opening_hours JSONB, -- {"monday": {"open": "09:00", "close": "18:00"}, ...}
    social_media JSONB, -- {"facebook": "url", "instagram": "url", ...}
    payment_methods JSONB, -- ["cash", "card", "transfer"]
    delivery_options JSONB, -- ["pickup", "delivery", "dine_in"]
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_profiles_tenant_id ON business_profiles(tenant_id);
```

### Inventory Module

#### categories

Product categories.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

#### products

Products/services offered by businesses.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- Original price for discounts
    cost DECIMAL(10, 2), -- Cost price
    quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    track_inventory BOOLEAN DEFAULT TRUE,
    images JSONB, -- Array of image URLs
    variants JSONB, -- Product variants (size, color, etc.)
    tags JSONB, -- Array of tags
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    UNIQUE(tenant_id, sku)
);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
```

### Orders Module

#### orders

Customer orders.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    delivery_method VARCHAR(50), -- 'pickup', 'delivery', 'dine_in'
    delivery_address TEXT,
    delivery_notes TEXT,
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_status CHECK (status IN (
        'pending', 'confirmed', 'preparing', 'ready', 
        'in_delivery', 'completed', 'cancelled'
    )),
    CONSTRAINT check_payment_status CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded'
    ))
);

CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### order_items

Items in an order.

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- Snapshot at order time
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### Notifications Module

#### notifications

User notifications.

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'order', 'message', 'system', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### Analytics Module

#### analytics_events

Track business events for analytics.

```sql
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'product_view', 'order_placed', etc.
    event_data JSONB,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_tenant_id ON analytics_events(tenant_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

## Audit Tables

### audit_logs

Track important system changes.

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
    entity_type VARCHAR(100) NOT NULL, -- 'product', 'order', 'user', etc.
    entity_id INTEGER NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Row-Level Security (RLS)

### Enable RLS on Tenant-Scoped Tables

```sql
-- Example for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for tenant isolation
CREATE POLICY tenant_isolation_policy ON products
    USING (tenant_id = current_setting('app.current_tenant_id')::INTEGER);

-- Policy for super admins (bypass tenant isolation)
CREATE POLICY super_admin_policy ON products
    USING (current_setting('app.current_user_role') = 'super_admin');
```

## Database Functions

### Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

## Indexes Strategy

### Performance Indexes
- Foreign keys (automatic in most cases)
- Frequently queried columns (tenant_id, status, created_at)
- Unique constraints (email, slug, order_number)

### Full-Text Search Indexes
```sql
-- For product search
CREATE INDEX idx_products_search ON products 
    USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));
```

## Data Retention

### Soft Deletes
- Most tables use `deleted_at` for soft deletes
- Actual deletion happens via scheduled cleanup jobs

### Archival Strategy
- Orders older than 2 years: Archive to separate table
- Analytics events older than 1 year: Aggregate and archive
- Audit logs older than 1 year: Archive to cold storage

## Backup Strategy

- **Frequency**: Daily automated backups
- **Retention**: 30 days for daily, 12 months for monthly
- **Method**: PostgreSQL pg_dump with compression
- **Storage**: S3-compatible storage with versioning

## Migration Strategy

- Use Alembic for schema migrations
- All migrations must be reversible
- Test migrations on staging before production
- Maintain migration documentation

## Performance Considerations

### Connection Pooling
- Use PgBouncer or SQLAlchemy pooling
- Pool size: 20-50 connections per application instance

### Query Optimization
- Use EXPLAIN ANALYZE for slow queries
- Add indexes based on query patterns
- Use materialized views for complex analytics

### Partitioning (Future)
- Partition large tables (orders, analytics_events) by date
- Implement when tables exceed 10M rows

## Security Considerations

- All passwords hashed with bcrypt
- Sensitive data encrypted at rest
- Use prepared statements (SQLAlchemy ORM)
- Regular security audits
- Principle of least privilege for database users

## Schema Versioning

Current Version: **1.0.0**

See `backend/app/migrations/` for migration history.
