# Project Context: Elysia Template

This project is a scalable production-ready backend boilerplate built with **ElysiaJS**, featuring a domain-driven (feature-based) architecture, integrated with **Prisma 7**, **Firebase Authentication**, and **Swagger UI**. The runtime is **Bun**.

## 🏗️ Architectural Rules (Domain-Driven Design)

All new features and domains must follow the modular, feature-based structure located in `src/modules/`. 

When creating a new feature (e.g., `product`), you MUST create a dedicated directory (`src/modules/product/`) containing exactly these files, cleanly separating concerns:

1.  **`model.ts` (Data & Validation)**: Define all TypeBox schemas for request validation (body, params, query) and any TypeScript types/interfaces here.
2.  **`service.ts` (Business Logic & Data Access)**: Isolate all Prisma database interactions and core business logic here. Services should NOT know about HTTP requests or responses.
3.  **`index.ts` (Controller & Routes)**: Define the Elysia routes, apply TypeBox validation using the models, and call the service methods. 

## 📝 Coding Conventions & Standards

To maintain a consistent API contract and codebase, you MUST adhere to the following standards:

### 1. Standardized Responses
Never return raw objects directly from a route if it is a successful operation. Always wrap successful responses using the shared utility.
- **DO**: `return successResponse(data, "Optional message");`
- **Import from**: `src/shared/response.ts`

### 2. Error Handling
Do not return HTTP error codes manually (e.g., `set.status = 404`). Instead, throw custom error classes. The global error handler (`src/plugins/error-handler.ts`) will catch these and format the response consistently.
- **DO**: `if (!user) throw new NotFoundError('User not found');`
- **Import from**: `src/shared/errors.ts` (Available errors: `AppError`, `NotFoundError`, etc.)

### 3. Route Protection (Authentication)
If a route requires authentication, it MUST be protected using the Firebase Auth guard.
- **Pattern**: Wrap the protected routes in `.guard({}, (app) => app.use(authPlugin)...)`
- **Import from**: `src/plugins/auth.ts`

### 4. Database Access
Always use the Prisma singleton instance provided by the database plugin. Do not instantiate new Prisma clients in your services.
- **Import from**: `src/plugins/db.ts`

### 5. Storage Access
Always use the Supabase singleton instance provided by the supabase plugin for interacting with Supabase Storage. Do not create new Supabase clients in your services.
- **Import from**: `src/plugins/supabase.ts`

## 🤖 AI Assistant Directives (Gemini)

- **Do not bypass the architecture**: Never put business logic directly inside the Elysia route handlers in `index.ts`. Always delegate to `service.ts`.
- **Validation**: Always use Elysia's built-in TypeBox for schema validation on incoming requests. Do not use Zod or custom validation logic unless explicitly requested.
- **Imports**: Ensure all imports using shared utilities or plugins correctly reference the `src/shared/` or `src/plugins/` directories.
- **Package Manager**: Always assume and use `bun` for script execution and package management (e.g., `bun install`, `bun add`). Do not use `npm` or `yarn`.
- **Testing**: Don't forget to test the module or feature first after finish implementation. ALWAYS write tests and verify they pass using `bun test` before concluding the task.
