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
- ✅ **Onboarding**: Guided module selection with carousel
- ✅ **Module Configuration**: Dynamic pricing and selection
- ✅ **Operations Screen**: Tab-based workspace with hamburger menu
- ✅ **Chat Module**: Real-time messaging with text, voice, images, and video (30s max)
- ✅ **Delivery Module**: Order tracking, status management, and service details
- ✅ **Inventory Module**: Products and services management with stock alerts
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
  - Automatic price recommendations (20-35% profit margin)
  - Stock tracking with low-stock alerts
  - Product images with optimization
  - Double confirmation for deletion
  - Profit margin calculations
- 🎁 **Promotions Module** - $4/month: Discount and promotion management
- 🤖 **Recommendation Module** - $5/month: AI-powered product recommendations
- 📊 **Analytics Module** - $7/month: Business insights and reporting
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

### Phase 1: Foundation ✅ (Current - Completed)
- [x] Project structure and documentation
- [x] Authentication module design and implementation
- [x] Business registration with OAuth (Google, Microsoft, LinkedIn)
- [x] Onboarding flow with module selection
- [x] 15-day free trial system
- [x] Backend core setup (FastAPI + SQLite)
- [x] Frontend core setup (Next.js + TypeScript)
- [x] Docker configuration

### Phase 2: Core Features (In Progress)
- [ ] Customer registration flow
- [ ] Login page for businesses and customers
- [ ] Logout functionality
- [ ] Business profile management
- [ ] Basic inventory management
- [ ] Order processing

### Phase 3: Advanced Features
- [ ] Real OAuth integration (replace simulated flow)
- [ ] Email verification system
- [ ] Password reset flow
- [ ] Analytics dashboard
- [ ] Real-time chat
- [ ] Notification system
- [ ] Payment integration

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
