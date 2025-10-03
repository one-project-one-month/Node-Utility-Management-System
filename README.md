# Node-Utility-Management-System

A comprehensive utility management system built with Node.js, TypeScript, and PostgreSQL for managing rental properties, tenants, billing, and customer services.

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
Quick reference to your `package.json` scripts:
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
```

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
```

### 4. Start PostgreSQL with Docker (Optional)

```bash
docker compose up -d
```

### 5. Setup database
```bash
npm run db:generate
npm run db:push
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
 ├── controllers/         # Route controllers
 ├── services/            # Business logic
 ├── routes/              # Express routes
 ├── middlewares/         # Validation/auth middlewares
 ├── lib/                 # Prisma client setup
 ├── validations/         # Zod schemas
 ├── common/              # Error classes & API responses
 ├── types/               # TypeScript definitions
 └── index.ts             # App entrypoint
prisma/                   # Database schema & migrations
 ├── schema.prisma        # Database schema
 ├── migrations/          # Database migrations
 └── seed.ts              # Database seeding
docker-compose.yml        # Docker compose file for postgresql
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

# Customer Service
POST /api/v1/tenants/:id/customer-services/create
GET  /api/v1/customer-services/
GET  /api/v1/customer-services/:id
PUT  /api/v1/customer-services/:id
```

### ❌ **Planned Endpoints**
```

# Rooms
GET    /api/v1/rooms
GET    /api/v1/rooms/:id
POST   /api/v1/rooms
PUT    /api/v1/rooms/:id
DELETE /api/v1/rooms/:id

# Tenants
GET    /api/v1/tenants
GET    /api/v1/tenants/:id
POST   /api/v1/tenants
PUT    /api/v1/tenants/:id
DELETE /api/v1/tenants/:id

# Contracts
GET    /api/v1/contracts
GET    /api/v1/contracts/:id
POST   /api/v1/contracts
PUT    /api/v1/contracts/:id
DELETE /api/v1/contracts/:id

# Bills
GET    /api/v1/bills
GET    /api/v1/bills/:id
POST   /api/v1/bills
PUT    /api/v1/bills/:id
DELETE /api/v1/bills/:id
```

## Development Status
- ✅ Project setup and configuration
- ✅ Database schema design
- ✅ Error handling infrastructure
- ✅ Prisma ORM setup
- ✅ Authentication system (JWT + bcrypt)
- ✅ User management API (CRUD operations)
- ✅ Customer service API
- ✅ Validation schemas (Zod)
- ✅ Role-based access control
- ✅ API documentation (Swagger)
- ❌ Room management API
- ❌ Tenant management API
- ❌ Contract management API
- ❌ Billing system API
- ❌ Invoice & Receipt generation

## Contributing
Please read [CONTRIBUTION_GUIDELINE.md](./CONTRIBUTION_GUIDELINE.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the ISC License.