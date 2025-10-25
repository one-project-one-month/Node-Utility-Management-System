# Contributing Guidelines

Thank you for contributing to this project! Please follow the rules below to keep our codebase clean, consistent, and easy to maintain.

---

## 🚀 Branch Naming

**Use the following format for branch names:**

- `feature/[description]` - For new features
- `fix/[description]` - For bug fixes
- `docs/[description]` - For documentation updates
- `refactor/[description]` - For code refactoring

**Examples:**

- `feature/add-authentication`
- `feature/user-management`
- `fix/billing-calculation`
- `docs/api-documentation`

---

## 📝 Git Commit Messages

We follow the **conventional commit** style for consistency:

- `feat:` → For new features
- `fix:` → For bug fixes
- `docs:` → For documentation changes
- `refactor:` → For code refactoring without changing functionality
- `style:` → For formatting changes
- `test:` → For adding or updating tests
- `chore:` → For maintenance tasks

**Examples:**

- `feat: add user authentication system`
- `fix: resolve billing calculation error`
- `docs: update API documentation`
- `refactor: optimize database queries`

---

## 📂 File Naming Convention

- Use **camelCase** for all files:
  **Examples:**
- `userController.ts`
- `userService.ts`

## 📂 Specific File Type Conventions

- **Controllers**: [entity]Controller.ts (e.g., `userController.ts`, `tenantController.ts`, `contractController.ts`)
- **Services**: [entity]Service.ts (e.g., `userService.ts`, `tenantService.ts`, `contractService.ts`)
- **Routes**: [entity]Route.ts (e.g., `userRoute.ts`, `tenantRoute.ts`, `contractRoute.ts`)
- **Middlewares**: [purpose]Middleware.ts (e.g., `validationMiddleware.ts`, `authMiddleware.ts`)
- **Validations**: [entity]Schema.ts (e.g., `userSchema.ts`, `tenantSchema.ts`, `contractSchema.ts`)
- **Types**: [domain].d.ts or [entity]Types.ts (e.g., `express.d.ts`, `userTypes.ts`)
- **Errors**: [type]Error.ts (e.g., `badRequestError.ts`, `notFoundError.ts`, `forbiddenError.ts`)
- **Helpers**: [purpose].ts (e.g., `checkDuplicateTenantData.ts`)
- **Config**: [purpose].ts (e.g., `swagger.ts`)

---

## 📂 Example

```ts
// src/index.ts

import userRoute from './routes/userRoute';
import roomRoute from './routes/roomRoute';

app.use('/api/v1/users', userRoute);
app.use('/api/v1/rooms', roomRoute);
```

---

```ts
// src/routes/userRoute.ts

import { Router } from 'express';
import {
  getAllUsersController,
  getUserController,
  createUserController,
} from '../controllers/userController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import { hasRole } from '../middlewares/authMiddleware';
import {
  CreateUserSchema,
  GetUserParamSchema,
  GetUserQuerySchema,
} from '../validations/userSchema';

const router = Router();

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetUserQuerySchema),
  getAllUsersController
);
router.get(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  getUserController
);
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateUserSchema),
  createUserController
);

export default router;
```

---

```ts
// src/controllers/userController.ts

import { NextFunction, Request, Response } from 'express';
import {
  getAllUsersService,
  getUserService,
  createUserService,
} from '../services/userService';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';

export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters = req.validatedQuery;

    const user = await getAllUsersService(filters);

    if (!user) {
      throw new NotFoundError('No users found');
    }

    successResponse(res, 'Users fetched successfully', user);
  } catch (error) {
    next(error);
  }
}

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserService(req.validatedParams.userId);

    if (!user) {
      throw new NotFoundError('No users found');
    }

    successResponse(res, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
}
export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await createUserService(req.validatedBody);

    successResponse(res, 'User created successfully', user, 201);
  } catch (error) {
    next(error);
  }
}
```

---

```ts
// src/services/userService.ts

import { BadRequestError, NotFoundError } from '../common/errors';
import { hashPassword } from '../common/auth/password';
import prisma from '../lib/prismaClient';
import {
  CreateUserType,
  GetUserQueryType,
  UpdateUserType,
} from '../validations/userSchema';
import { Prisma } from '../../generated/prisma';

export async function getAllUsersService(query: GetUserQueryType) {
  const whereClause: Prisma.UserWhereInput = {};

  if (query.email) {
    whereClause.email = query.email;
  }

  return await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
      createdAt: true,
      // Exclude password field from the result
    },
  });
}

export async function getUserService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password from results
    },
  });

  return user;
}

export async function createUserService(data: CreateUserType) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      userName: data.userName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
```

---

```ts
// src/validations/userSchema.ts

import z from 'zod';
import { UserRole } from '../../generated/prisma';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetUserQuerySchema = z.object({
  email: z.email().optional(),
});

export const CreateUserSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z
    .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant'")
    .default(UserRole.Tenant),
});

export const UpdateUserSchema = z
  .object({
    userName: z.string().optional(),
    email: z.email().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    role: z.enum(UserRole).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
```

---

```ts
// src/routes/roomRoute.ts
import { Router } from 'express';
import {
  getAllRoomsController,
  getRoomController,
  createRoomController,
  updateRoomController,
} from '../controllers/roomController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';

import {
  CreateRoomSchema,
  UpdateRoomSchema,
  RoomIdSchema,
  GetAllRoomsQuerySchema,
} from '../validations/roomSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateRoomSchema),
  createRoomController
);

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllRoomsQuerySchema),
  getAllRoomsController
);

router.get(
  '/:roomId', //matches controller param
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  getRoomController
);

router.put(
  '/:roomId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  validateRequestBody(UpdateRoomSchema),
  updateRoomController
);

export default router;
```

---

## 📊 Database Guidelines

### Prisma Schema Conventions

- Use `camelCase` for database column names
- Use `PascalCase` for model names
- Always include `createdAt` and `updatedAt` timestamps
- Use meaningful enum names (e.g., `UserRole`, `RoomStatus`)

### Migration Best Practices

```bash
# Using Makefile (Recommended)
make db-migrate       # Create new migration
make db-push          # Push schema changes (dev only)
make db-generate      # Generate Prisma client
make db-setup         # Complete setup (generate + push + seed)
make db-reset         # Reset database completely

# Using NPM directly
npm run db:migrate
npm run db:push
npm run db:generate
```

---

## 🔒 Security Guidelines

- **Never commit sensitive data** (API keys, passwords, tokens)
- **Always hash passwords** using bcrypt before storing (12 salt rounds)
- **Use JWT tokens** for authentication with proper expiration
- **Validate all inputs** using Zod schemas
- **Sanitize database queries** using Prisma (prevents SQL injection)
- **Use HTTPS** in production environments
- **Implement rate limiting** for sensitive endpoints (login attempts)
- **Use role-based access control** with middleware
- **Set proper CORS policies** for production
- **Never expose sensitive fields** in API responses (passwords, refresh tokens)

---

## 🧨 Testing Guidelines

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Test error handling scenarios
- Mock external dependencies in tests
- Maintain at least 80% code coverage

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📝 API Response Format

All API responses should follow this consistent format using the `successResponse` helper:

```typescript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "content": { /* data */ },
  "status": 200
}

// Error Response (handled by errorHandler middleware)
{
  "success": false,
  "message": "Error description",
  "status": 400
}

// Usage in controllers
import { successResponse } from '../common/apiResponse';

successResponse(res, 'User created successfully', { user: newUser }, 201);
```

---

## 🚫 Common Mistakes to Avoid

- Don't expose sensitive data in API responses (passwords, refresh_token)
- Don't use `any` type in TypeScript - use Prisma types or define custom types
- Don't skip input validation - always validate with Zod schemas
- Don't commit `.env` files - use `.env.example` instead
- Don't write business logic in controllers - use services layer
- Don't forget error handling in async functions - use try/catch with next()
- Don't forget to hash passwords before storing in database
- Don't skip role-based access control for protected endpoints
- Don't forget to exclude sensitive fields in Prisma select statements
- Don't use direct database field names in API responses - use consistent naming

---

## 🛠️ Development Workflow with Makefile

### Quick Start Commands

```bash
# New developer setup
make quick-setup      # Install + env + docker + db setup

# Daily development
make dev              # Start development server
make db-studio        # Open database GUI
make docker-up        # Start PostgreSQL

# Code quality checks
make lint             # Run ESLint
make format           # Format with Prettier
make type-check       # TypeScript validation

# Database operations
make db-reset         # Fresh database
make db-migrate       # Create migration
make backup-db        # Backup database

# View all commands
make help
```

### Pre-commit Workflow

```bash
# Before committing code
make lint-fix         # Fix linting issues
make format           # Format code
make type-check       # Check types
make test             # Run tests (when available)
```

---

## 🤝 Pull Requests

- Keep PRs small and focused on a single feature or fix
- Link related issues in the PR description
- Request at least one reviewer before merging
- Ensure all tests pass before submitting
- Update documentation if needed
- Follow the PR template (if available)

### PR Checklist

- [ ] Code follows the style guidelines (`make lint`)
- [ ] Code is properly formatted (`make format`)
- [ ] TypeScript checks pass (`make type-check`)
- [ ] Self-review of the code completed
- [ ] Code is commented where necessary
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)
