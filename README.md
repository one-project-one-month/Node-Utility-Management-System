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

Default:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5433/mydb?schema=public"
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
docker-compose.yml        # Docker compose file for postgresql
```