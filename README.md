# Modular SaaS Platform

A modern, scalable SaaS platform designed to connect local businesses with customers. Built with a modular architecture that allows businesses to enable or disable features based on their subscription plan.

## 🎯 Target Audience

- Local stores
- Barbershops & Hair Salons
- Restaurants
- Pharmacies
- Independent workers
- Small to medium-sized businesses

## ✨ Key Features

- **Modular Architecture**: Enable/disable features based on subscription
- **Tab-Based Operations Screen**: Browser-like workspace with dynamic module tabs
- **Multi-Platform**: Web and mobile applications
- **OAuth Authentication**: Google, Microsoft, LinkedIn
- **Onboarding Flow**: Guided module selection with 15-day free trial
- **Chat Module**: Real-time customer communication with text, voice, images, and video
- **Delivery Module**: Order tracking with status management and service details
- **Multi-Tenancy**: Secure tenant isolation
- **Real-time Features**: Chat, notifications, live updates
- **Analytics Dashboard**: Business insights and metrics
- **Inventory Management**: Product and stock control
- **Order Management**: Complete order lifecycle
- **Billing & Subscriptions**: Integrated payment processing

## 🏗️ Architecture

### Modular Monolith

The system follows a **Modular Monolith** architecture with **Clean Architecture** principles:

- Single deployment unit for simplified operations
- Clear module boundaries for maintainability
- Shared infrastructure for efficiency
- Future-proof for microservices extraction if needed

### Tech Stack

#### Frontend
- **Web**: Next.js 14+, TypeScript, TailwindCSS
- **Mobile**: React Native, Expo

#### Backend
- **API**: Python, FastAPI
- **Database**: PostgreSQL
- **Cache**: Redis
- **Background Jobs**: Celery

#### Infrastructure
- **Containers**: Docker, Docker Compose
- **Reverse Proxy**: Nginx
- **Cloud**: DigitalOcean
- **Storage**: S3-Compatible (DigitalOcean Spaces)

## 📁 Project Structure

```
my-saas/
├── backend/          # FastAPI backend application
├── frontend/         # Next.js web application
├── mobile/           # React Native mobile app
├── docs/             # Comprehensive documentation
├── scripts/          # Utility scripts
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd my-saas

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

**Services:**
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Manual Setup

See the [Setup Guide](./docs/development/setup-guide.md) for detailed instructions.

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Architecture
- [System Architecture](./docs/architecture/system-architecture.md)
- [Technology Stack Decision](./docs/technical-decisions/001-tech-stack.md)
- [Authentication Strategy](./docs/technical-decisions/002-authentication-strategy.md)

### Development
- [Setup Guide](./docs/development/setup-guide.md)
- [Project Structure](./docs/development/project-structure.md)
- [Coding Standards](./docs/development/coding-standards.md)

### API
- [API Overview](./docs/api/api-overview.md)
- Interactive Docs: http://localhost:8000/docs

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest

# With coverage
pytest --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm test

# With coverage
npm test -- --coverage
```

## 🔧 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow [Coding Standards](./docs/development/coding-standards.md)
   - Write tests for new features
   - Update documentation as needed

3. **Run Tests & Linting**
   ```bash
   # Backend
   cd backend
   pytest
   black app/
   flake8 app/

   # Frontend
   cd frontend
   npm test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git commit -m "feat(module): description of changes"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/)

5. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📦 Available Modules

### Core Modules
- ✅ **Authentication**: OAuth, JWT, user management
  - Business registration with OAuth (Google, Microsoft, LinkedIn)
  - **Customer registration with email/password and OAuth**
  - **Customer login system**
  - Customer preferences for personalized recommendations
- ✅ **Onboarding**: Guided module selection with carousel
- ✅ **Module Configuration**: Dynamic pricing and selection
- ✅ **Operations Screen**: Tab-based workspace with hamburger menu
- ✅ **Chat Module**: Real-time messaging with text, voice, images, and video (30s max)
- ✅ **Delivery Module**: Order tracking, status management, and service details
- ✅ **Inventory Module**: Products and services management with stock alerts
  - Manage physical products and intangible services
  - **Edit products directly from detail modal**
  - Automatic price recommendations (20-35% profit margin)
  - Stock tracking with low-stock alerts
  - Product images with optimization
  - Double confirmation for deletion
  - Profit margin calculations
  - **Precise currency handling** (no floating-point errors)
- ✅ **Analytics Module**: 3-tier pricing (Basic, Advanced, Premium) with mock data
- ✅ **Customer Dashboard**: Modern home screen with discovery features
  - Hamburger menu with profile, favorites, history, reviews
  - Mobile-optimized menu (right-aligned on mobile, left on desktop)
  - Global search bar for businesses, products, and services
  - Hero section with gradient design
  - Category discovery cards (Fast Food, Local Stores, Services)
  - Mobile-first responsive design
- ✅ **Customer Profile Management**: Edit profile information
  - Editable name field
  - Non-editable email and auth provider (security)
  - Clean, modern profile interface
- ✅ **Favorites System**: Save favorite businesses
  - Maximum 10 favorites per customer
  - Add/remove favorites with confirmation
  - Visual cards with business information
  - Quick access to business details
- ✅ **Purchase History**: View past purchases and services
  - Paginated list (15 items per page)
  - Purchase details (business, product, date, status, amount)
  - Responsive table/card layout
  - Status tracking (pending, completed, cancelled, delivered)
- ✅ **Review History**: View all customer reviews
  - Paginated list (20 items per page)
  - Star ratings and comments
  - Review date and business information
  - Clean, readable review cards
- ✅ **Business Search & Discovery**: Search and filter businesses
  - Search by name, type, city, and department
  - Paginated results with business cards
  - **Favorite button on each business card**
  - **Heart icon changes color when favorited**
  - **Favorites synchronized across all pages**
  - Business detail view
- ✅ **Business Detail Page**: Complete business profile
  - Business information and contact details
  - Products and services listing with prices
  - **Favorite toggle button**
  - **Place Order button**
  - Modern, responsive layout
- ✅ **Order Creation System**: Complete order flow
  - Add products/services to order
  - Adjust quantities (max 20 items per order)
  - Remove items from order
  - Real-time total calculation
  - Order summary display
- ✅ **Checkout Flow**: Payment and order completion
  - Order summary with itemized list
  - Payment method selection
  - **Cash on delivery/service option**
  - Complete purchase functionality
  - Mobile-friendly modals
- 🚧 **Business Profile**: Business information and settings
- 🚧 **Orders**: Order processing and tracking

### Optional Modules (Selectable during onboarding)
- 💬 **Chat Module** - $5/month: Customer communication without sharing personal phone
  - Text, voice, images, and short videos
  - 72-hour chat retention after service completion
  - WhatsApp-like voice recording (hold to record, swipe to cancel)
  - Service-based chat availability
- 🚚 **Delivery Module** - $6/month: Delivery tracking and management
  - Order status tracking (Received, In Progress, Delivered, Returned)
  - 48-hour visibility window
  - Support for physical deliveries and intangible services
  - Auto-incremental order IDs
  - Detailed order modals
- 📦 **Inventory Module** - $6/month: Product and stock management
  - Manage physical products and intangible services
  - **Edit mode in product details modal**
  - Automatic price recommendations (20-35% profit margin)
  - Stock tracking with low-stock alerts
  - Product images with optimization
  - Double confirmation for deletion
  - Profit margin calculations
  - **Integer-based currency handling** for precision
- 🎁 **Promotions Module** - $4/month: Discount and promotion management
- 🤖 **Recommendation Module** - $5/month: AI-powered product recommendations
- ✅ **Analytics Module** - Tiered pricing with expandable features:
  - **Basic Analytics** ($7/month): Essential metrics
    - Total Revenue & Orders
    - Top 10 Products/Services
    - Active Customers Count
    - Basic Sales Trends (7-day chart with hover tooltips)
  - **Advanced Analytics** ($12/month): Includes Basic + intermediate analysis
    - Everything in Basic
    - Customer Retention & CLV
    - Inventory Performance
    - Churn Rate Analysis
    - Period Comparisons (Today/Week/Month)
    - Profit Margin Analysis
  - **Premium Analytics** ($18/month): Includes Advanced + ML predictions
    - Everything in Advanced
    - AI Sales Predictions (Next week forecast)
    - Customer Segmentation (VIP, Regular, Occasional, At Risk)
    - Cohort Analysis
    - Automated Recommendations
    - Custom Reports & Exports
  - **Note**: Currently displays mock data for demonstration. Real-time data integration pending.
- 📅 **Scheduling Module** - $5/month: Appointment booking system
- ⭐ **Reviews & Ratings Module** - $3/month: Customer feedback system

### Included by Default
- 💳 **Billing & Subscriptions**: Payment management (included for all businesses)
- 🔔 **Notifications**: Push and email notifications (included)

**Trial Period**: All businesses get 15 days of free trial access to selected modules.

Legend: ✅ Complete | 🚧 In Progress | 📋 Planned

## 🔐 Security

- OAuth 2.0 authentication
- JWT with refresh token rotation
- Row-level security in database
- Rate limiting on API endpoints
- HTTPS/TLS encryption
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🌍 Environment Variables

### Backend

```env
DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
# ... see .env.example for complete list
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# ... see .env.local.example for complete list
```

## 📈 Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Project structure and documentation
- [x] Authentication module design and implementation
- [x] Business registration with OAuth (Google, Microsoft, LinkedIn)
- [x] **Customer registration with email/password and OAuth**
- [x] **Customer login system**
- [x] **Customer preferences system (Beauty, Fast Food, Pharmacy, Specialists)**
- [x] Onboarding flow with module selection and tiered pricing
- [x] 15-day free trial system
- [x] Backend core setup (FastAPI + SQLite)
- [x] Frontend core setup (Next.js + TypeScript)
- [x] Docker configuration
- [x] Operations Screen with tab-based navigation
- [x] Chat Module (text, voice, images, video)
- [x] Delivery Module (order tracking and status management)
- [x] Inventory Module (products/services with edit capability and precise currency handling)
- [x] Analytics Module (3-tier pricing: Basic, Advanced, Premium with mock data)
- [x] **Customer Dashboard (modern home screen with discovery)**
- [x] **Business Search & Discovery (search, filter, detail view)**

### Phase 2: Core Features (In Progress)
- [x] Customer registration flow (email/password and OAuth)
- [x] Customer login page
- [x] Customer preferences system
- [x] **Customer home screen redesign (discovery interface)**
- [x] **Business search and discovery system**
- [x] **Customer profile management (edit name)**
- [x] **Favorites system (max 10 items)**
- [x] **Purchase history view (paginated, 15 per page)**
- [x] **Review history view (paginated, 20 per page)**
- [x] **Favorites integration in business discovery**
- [x] **Business detail page with products/services**
- [x] **Order creation system (max 20 items)**
- [x] **Checkout flow with payment methods**
- [x] **Cash on delivery/service option**
- [ ] Business login page (backend pending)
- [ ] Logout functionality for both business and customers
- [ ] Business profile management
- [ ] Customer features:
  - [x] Search businesses and specialists by name/category
  - [x] Favorites system (max 10 items)
  - [x] Favorites integration in discovery
  - [x] Purchase history view
  - [x] Profile management (edit name)
  - [x] Review history display
  - [x] Place orders with businesses
  - [ ] Chat with businesses (following Chat Module rules)
  - [ ] Delivery tracking for customers
  - [ ] Create and submit reviews
  - [ ] Customer profile management (change photo, password)
- [ ] Order processing backend
- [ ] Connect Analytics Module with real data from Inventory and Delivery modules

### Phase 3: Advanced Features
- [ ] Real OAuth integration (replace simulated flow)
- [ ] Email verification system
- [ ] Password reset flow
- [ ] Real-time chat with WebSockets
- [ ] Notification system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Promotions Module implementation
- [ ] Recommendation Module with AI
- [ ] Scheduling Module for appointments
- [ ] Reviews & Ratings Module

### Phase 4: Optimization
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] CDN integration
- [ ] Monitoring and logging
- [ ] Migration to PostgreSQL for production

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

See [Coding Standards](./docs/development/coding-standards.md) for guidelines.

## 📄 License

[Your License Here]

## 👥 Team

- **Technical Lead**: [Your Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **Mobile Developer**: [Name]
- **UI/UX Designer**: [Name]

## 📞 Support

For questions or issues:
- 📧 Email: support@yourdomain.com
- 💬 Slack: [Your Slack Channel]
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

Built with modern technologies and best practices:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [React Native](https://reactnative.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

---

**Made with ❤️ by eJSc**
# my-saas
