# Contributing Guidelines

Thank you for contributing to this project! Please follow the rules below to keep our codebase clean, consistent, and easy to maintain.

---

## 🚀 Branch Naming

- Use the following format for branch names:
**Examples:**
- `feature/add-authentication`
- `feature/update-user-profile`

---

## 📝 Git Commit Messages

We follow the **conventional commit** style for consistency:

- `feat:` → For new features  
- `fix:` → For bug fixes  
- `docs:` → For documentation changes  
- `refactor:` → For code refactoring without changing functionality    

**Examples:**

---

## 📂 File Naming Convention

- Use **camelCase** for all files:
**Examples:**
- `userController.ts`
- `userService.ts`

## 📂 Specific File Type Conventions

- Controllers: [entity]Controller.ts (e.g., `userController.ts`, `productController.ts`)

- Services: [entity]Service.ts (e.g., `userService.ts`, `authService.ts`)

- Routes: [entity]Routes.ts (e.g., `userRoutes.ts`, `adminRoutes.ts`)

- Middlewares: [purpose]Middleware.ts (e.g., `validationMiddleware.ts`, `authMiddleware.ts`)

- Validations: [entity]Schema.ts (e.g., `userSchema.ts`, `productSchema.ts`)

- Types: [domain].d.ts or [entity]Types.ts (e.g., `express.d.ts`, `userTypes.ts`)

---

## 📂 Example 

```ts
// src/index.ts

import userRoute from './routes/userRoute'

app.use("/api/v1/users", userRoute)
```

---

```ts
// src/routes/userRoute.ts

import { Router } from "express";
import {
  getAllUsersController,
  getUserController,
  createUserController,
} from "../controllers/userController";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "../middlewares/validationMiddlware";
import { CreateUserSchema, GetUserParamSchema, GetUserQuerySchema } from "../validations/userSchema";

const router = Router();

router.get("/", validateRequestQuery(GetUserQuerySchema), getAllUsersController);
router.get("/:userId", validateRequestParams(GetUserParamSchema) ,getUserController);
router.post("/",validateRequestBody(CreateUserSchema), createUserController);

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

import { BadRequestError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateUserType,
  GetUserQueryType,
} from '../validations/userSchema';
// import { Prisma } from '../../generated/prisma';

export async function getAllUsersService(query: GetUserQueryType) {
  const whereClause: any = {}
  // OR 
  // const whereClause: Prisma.UserWhereInput = {} // for type safety

  if (query.email) {
    whereClause.email = query.email;
  }

  return await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      updated_at: true,
      created_at: true,
      // Exclude password field from the result
    }
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
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  // In real application, you would hash the password here
  // const hashedPassword = await bcrypt.hash(data.password, 12);

  return await prisma.user.create({
    data: {
      ...data,
      // password: hashedPassword, // Use hashed password
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password from response
    },
  });
}


```

---

```ts
// src/validations/userSchema.ts

import z from 'zod';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetUserQuerySchema = z.object({
  email: z.email().optional(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;


```



## 🤝 Pull Requests

- Keep PRs small and focused on a single feature or fix.  
- Link related issues in the PR description.  
- Request at least one reviewer before merging.