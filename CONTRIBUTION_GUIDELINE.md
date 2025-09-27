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


## 🤝 Pull Requests

- Keep PRs small and focused on a single feature or fix.  
- Link related issues in the PR description.  
- Request at least one reviewer before merging.