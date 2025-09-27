# Node-Utility-Management-System

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
- `npm run prisma:generate` – regenerate Prisma client
- `npm run prisma:push` – push schema changes to DB
- `npm run prisma:migrate` – create new migration
- `npm run prisma:studio` – open Prisma Studio
- `npm run seed` – seed initial data
```

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/ZawHlaingPhyoTsuki/ums-starter.git
cd ums-starter
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
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

### 4. Start PostgreSQL with Docker (Optional)

```bash
docker compose up -d
```

### 5. Setup database
```bash
npm run prisma:generate
npm run prisma:push
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
 ├── docker-compose.yml   # Docker compose file for postgresql
 └── index.ts             # App entrypoint
```