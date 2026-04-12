# Elysia Feature-Based Project Structure

A scalable, production-ready backend boilerplate built with **ElysiaJS**, featuring a domain-driven (feature-based) architecture, integrated with **Prisma 7 (Supabase PostgreSQL)**, **Supabase Storage**, **Firebase Authentication**, and **Swagger UI**.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [ElysiaJS](https://elysiajs.com)
- **Language**: TypeScript
- **Database (ORM)**: [Prisma 7](https://www.prisma.io) with PostgreSQL (Supabase)
- **Storage**: [Supabase Storage](https://supabase.com/storage)
- **Authentication**: [Firebase Admin SDK](https://firebase.google.com/docs/admin)
- **Validation**: [TypeBox](https://github.com/sinclairzx81/typebox) (Elysia built-in)
- **Documentation**: [Swagger](https://elysiajs.com/plugins/swagger.html)

---

## ✨ Key Features

- **Feature-Based Architecture**: Modular design where each domain (e.g., `auth`, `storage`) contains its own controller, service, and model.
- **Standardized Responses**: Consistent JSON response format (`success`, `data`, `message`).
- **Global Error Handling**: Centralized error mapping for custom application errors and validation failures.
- **Firebase Auth Middleware**: Easy-to-use `.guard()` to protect routes using Firebase JWTs. (Includes a `dev-token` bypass for easy local development).
- **Supabase Storage Integration**: Dedicated module for handling secure file uploads directly to Supabase Storage.
- **Auto-Generated Swagger**: Interactive API documentation at `/swagger`.
- **Database Singleton**: Efficient connection management with Prisma 7.
- **Production-Ready CI/CD**: Pre-configured GitHub Actions workflow running tests against an isolated, ephemeral PostgreSQL service container.

---

## 📂 Project Structure

```text
src/
├── index.ts              # App entry point & global setup
├── modules/              # Feature modules (Domain-driven)
│   ├── auth/             # Authentication & user profile sync
│   ├── example/          # Example boilerplate module
│   └── storage/          # File upload & storage handling
├── plugins/              # Shared Elysia plugins
│   ├── auth.ts           # Firebase Auth middleware & dev bypass
│   ├── db.ts             # Prisma Client singleton
│   ├── error-handler.ts  # Global error interceptor
│   ├── firebase.ts       # Firebase Admin initialization
│   ├── supabase.ts       # Supabase Client initialization
│   └── swagger.ts        # API Documentation config
└── shared/               # Cross-cutting utilities
    ├── errors.ts         # Custom Error classes
    └── response.ts       # Standardized success/error wrappers
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Install Bun](https://bun.sh)
- A [Supabase](https://supabase.com) project (PostgreSQL & Storage)
- A [Firebase](https://firebase.google.com) project (Service Account JSON)

### 2. Setup Environment
Create a `.env` file in the root directory:
```env
NODE_ENV="development"

# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Firebase Admin
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Supabase Storage
SUPABASE_URL="https://[project-id].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhb..."
SUPABASE_BUCKET_NAME="images"
```

### 3. Install & Migrate
```bash
bun install
npx prisma db push
npx prisma generate
```

### 4. Start Development
```bash
bun dev
```
The server will start at `http://localhost:3000`. The console will display the link to the Swagger documentation.

---

## 📖 Developer Guide

### Creating a New Feature
1. Create a folder in `src/modules/<feature_name>`.
2. Define your TypeBox schemas in `model.ts`.
3. Implement business logic in `service.ts`.
4. Define routes and apply validation in `index.ts`.
5. Register the new controller in `src/index.ts`.

### Standardized Responses
Always wrap your successful returns with `successResponse`:
```typescript
import { successResponse } from '../../shared/response';

return successResponse(data, "Success message (optional)");
```

### Error Handling
Throw custom errors to let the global `errorHandler` manage the response:
```typescript
import { NotFoundError } from '../../shared/errors';

if (!user) throw new NotFoundError('User not found');
```

### Protecting Routes & Authentication Bypass
Use the `authPlugin` within a `.guard()` to require a Firebase token:
```typescript
.guard({}, (app) => app
    .use(authPlugin)
    .get('/me', ({ user }) => successResponse(user))
)
```
**Local Development:** When `NODE_ENV` is set to `development` or `test`, you can bypass Firebase token validation by sending the exact string `Bearer dev-token` in the Authorization header.

---

## 📑 API Documentation
Access the interactive Swagger UI at:  
👉 **`http://localhost:3000/swagger`**

Test protected routes by clicking the **"Authorize"** button and providing your Firebase ID Token (or `dev-token` locally).

---

## 🤝 Frontend Integration Guide

### 1. Handling Responses
We use a standard response wrapper for all API endpoints. Use these TypeScript interfaces for your frontend services:

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 2. Authentication
All protected routes require an `Authorization` header with a Firebase ID Token:

```typescript
const token = await firebaseUser.getIdToken();

const response = await fetch('/apiv1/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Error Handling
Global errors and validation failures are mapped consistently.
- **401 Unauthorized**: Missing or invalid Firebase token.
- **400/422 Validation Error**: Request params/body don't match the TypeBox schema. Check `error.details` for specific field failures.
- **404 Not Found**: The requested resource does not exist.
