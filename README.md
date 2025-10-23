# Node-Utility-Management-System

A comprehensive utility management system built with Node.js, TypeScript, and PostgreSQL for managing rental properties, tenants, billing, and customer services.

## Server Deployment Info

This project is deployed on render. Here you can access the server:
1. https://node-utility-management-system.onrender.com/
2. https://node-utility-management-system-fye1.onrender.com/

### Swagger Docs for endpoints
```
1. https://node-utility-management-system.onrender.com/docs/
2. https://node-utility-management-system-fye1.onrender.com/docs/
```

## Features
- **Multi-role User Management** - Admin, Staff, and Tenant roles
- **Property Management** - Room tracking with status and pricing
- **Tenant Management** - Complete tenant profiles and registration
- **Contract Management** - Flexible rental agreements with different types
- **Billing System** - Comprehensive billing including utilities and fees
- **Customer Service** - Issue tracking and maintenance requests
- **Invoice & Receipt Generation** - Complete payment workflow

## Tech Stack
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schemas
- **Authentication**: JWT + bcrypt
- **Development**: Hot reload with tsx

---
## Requirements
Make sure you have the following installed before starting:
- **Node.js** >= 22.x  
  ```bash
  node --version
  v22.13.0
  ```
- **npm** >= 11.x
  ```bash
  npm --version
  11.6.0
  ```
- **Docker** >= 28.x (Optional)
  ```bash
  docker --version
  Docker version 28.3.3, build 980b856
  ```

## Scripts

### Using Makefile (Recommended)
```bash
# Quick setup for new developers
make quick-setup

# Development
make dev              # Start development server
make db-studio        # Open Prisma Studio
make docker-up        # Start PostgreSQL

# Database operations
make db-setup         # Complete DB setup
make db-reset         # Reset database
make db-migrate       # Create migration

# Code quality
make lint             # Run ESLint to check for code issues
make lint-fix         # Run ESLint and automatically fix fixable issues
make format           # Format with Prettier
make type-check       # TypeScript check

# View all available commands
make help
```

### NPM Scripts
```markdown
## Available Scripts
- `npm run dev` – start in development with hot reload
- `npm start` – build & run in production
- `npm run build` – compile TypeScript to JavaScript
- `npm run db:generate` – regenerate Prisma client
- `npm run db:push` – push schema changes to DB
- `npm run db:migrate` – create new migration
- `npm run db:studio` – open Prisma Studio
- `npm run seed` – seed initial data
- `npm run lint` – eslint check
- `npm run lint:fix` – eslint auto fix
```

## To get credential from Google for nodemailer auth
🔐 1. Enable 2-Step Verification
- Go to https://myaccount.google.com/security
- Scroll to the "Signing in to Google" section.
- Find 2-Step Verification.
- Click it and set it up (if not already enabled).

🔑 2. Generate an App Password
- Scroll down to App passwords (under "Signing in to Google").
- Click App passwords
- Under "Select app", choose "Mail".
- Under "Select device", choose "Other", and type something like DocumentStamp App.
- Click Generate.
- Copy the 16-character app password

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/one-project-one-month/Node-Utility-Management-System.git
cd Node-Utility-Management-System
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy .env.example to .env and adjust if needed:
```bash
cp .env.example .env
```

Default environment variables:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5433/mydb?schema=public"
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
MAIL_HOST=YOUR_EMAIL
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=GOOGLE_APP_PASSWORD
```

### 4. Start PostgreSQL with Docker (Optional)

```bash
docker compose up -d
```

### 5. Setup database
```bash
npm run db:migrate
npm run seed   # optional, seed sample data
```

### 6. Run the app
Development mode:
```bash
npm run dev
```

Production build:
```bash
npm start

```

## Project Structure
```bash
src/
 ├── controllers/         # Route controllers (auth, user, tenant, contract, etc.)
 ├── services/            # Business logic layer
 ├── routes/              # Express route definitions
 ├── middlewares/         # Auth, validation, error handling
 ├── validations/         # Zod validation schemas
 ├── common/              # Shared utilities
 │   ├── auth/            # JWT, password hashing, CORS
 │   ├── errors/          # Custom error classes
 │   └── utils/           # Logger, rate limiting
 ├── config/              # Swagger configuration
 ├── helpers/             # Utility functions
 ├── lib/                 # Prisma client setup
 ├── types/               # TypeScript type definitions
 └── index.ts             # Application entry point
prisma/                   # Database layer
 ├── schema.prisma        # Database schema definition
 ├── migrations/          # Database migration files
 └── seed.ts              # Database seeding script
generated/                # Auto-generated Prisma client
docker-compose.yml        # PostgreSQL container setup
swagger.yaml              # API documentation
Makefile                  # Development workflow automation
```

## Database Schema
The system uses a comprehensive relational database with the following entities:

- **Users** - Authentication and role management (Admin/Staff/Tenant)
- **Rooms** - Property units with status tracking (Available/Rented/Purchased/InMaintenance)
- **Tenants** - Resident profiles linked to users and rooms
- **Contracts** - Rental agreements with flexible types and durations
- **Bills** - Comprehensive billing including rent, utilities, and additional fees
- **Customer Service** - Issue tracking with categories and priority levels
- **Invoices & Receipts** - Complete payment workflow management

## API Endpoints

### ✅ **Implemented Endpoints**
```
# Authentication
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token

# Users (Admin/Staff only)
GET    /api/v1/users
GET    /api/v1/users/:userId
POST   /api/v1/users
PUT    /api/v1/users/:userId
DELETE /api/v1/users/:userId

# Rooms (Admin/Staff only)
GET    /api/v1/rooms
GET    /api/v1/rooms/:roomId
POST   /api/v1/rooms
PUT    /api/v1/rooms/:roomId
DELETE /api/v1/rooms/:roomId

# Tenants (Admin/Staff only)
GET    /api/v1/tenants
GET    /api/v1/tenants/:tenantId
POST   /api/v1/tenants
PUT    /api/v1/tenants/:tenantId
GET /api/v1/tenants/:tenantId/receipts (All roles)

# Occupants (Admin/Staff only)
GET    /api/v1/occupants
GET    /api/v1/occupants/:occupantId
POST   /api/v1/occupants
PUT    /api/v1/occupants/:occupantId

# Contract Types (Admin/Staff only)
GET    /api/v1/contract-types
GET    /api/v1/contract-types/:contractTypeId
POST   /api/v1/contract-types
PUT    /api/v1/contract-types/:contractTypeId

# Contracts
POST   /api/v1/contracts (Admin/Staff)
GET    /api/v1/contracts (Admin/Staff)
GET    /api/v1/contracts/show/:contractId (Admin/Staff)
PUT    /api/v1/contracts/:contractId (Admin/Staff)
GET    /api/v1/tenants/:tenantId/contracts (All roles)

# Total Units (Admin/Staff only)
GET    /api/v1/total-units
GET    /api/v1/total-units/:id
POST   /api/v1/total-units
PUT    /api/v1/total-units/:id
DELETE /api/v1/total-units/:id

# Bills (Admin/Staff only)
GET    /api/v1/bills
GET    /api/v1/bills/:billId
POST   /api/v1/bills
PUT    /api/v1/bills/:billId

# Invoices
POST   /api/v1/invoices (Admin/Staff)
GET    /api/v1/invoices (Admin/Staff)
GET    /api/v1/invoices/:invoiceId (Admin/Staff)
PUT    /api/v1/invoices/:invoiceId (Admin/Staff)
GET    /api/v1/tenants/:tenantId/invoices/latest (All roles)
GET    /api/v1/tenants/:tenantId/invoices/history (All roles)

# Customer Service
POST /api/v1/tenants/:id/customer-services/create
GET  /api/v1/customer-services/
GET  /api/v1/customer-services/:id
PUT  /api/v1/customer-services/:id

# Receipts
GET  /api/v1/receipts
GET  /api/v1/receipts/:id
POST /api/v1/receipts
PUT  /api/v1/receipts/:id
POST /api/v1/receipts/send-mail (Admin/Staff)
```

## Development Status
- ✅ Project setup and configuration
- ✅ Database schema design
- ✅ Error handling infrastructure
- ✅ Prisma ORM setup
- ✅ Authentication system (JWT + bcrypt)
- ✅ User management API (CRUD operations)
- ✅ Tenant management API (CRUD operations)
- ✅ Contract management API (CRUD operations)
- ✅ Contract type management API (CRUD operations)
- ✅ Customer service API (CRUD operations)
- ✅ Receipt management API (CRUD operations)
- ✅ Total units management API (CRUD operations)
- ✅ Validation schemas (Zod)
- ✅ Role-based access control
- ✅ API documentation (Swagger)
- ✅ Rate limiting (login attempts)
- ✅ CORS configuration
- ✅ Custom logging middleware
- ✅ Room management API
- ✅ Billing system API
- ✅ Invoice management API
- ✅ Mail Feature Added

## Contributing
Please read [CONTRIBUTION_GUIDELINE.md](./CONTRIBUTION_GUIDELINE.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the ISC License.
