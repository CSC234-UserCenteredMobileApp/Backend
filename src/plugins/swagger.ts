import { swagger } from '@elysiajs/swagger'

export const swaggerPlugin = swagger({
    documentation: {
        info: {
            title: 'Elysia API Documentation',
            version: '1.0.0',
            description: `
### 🚀 Welcome to the Elysia API
This documentation is auto-generated and serves as the single source of truth for our API contract.

### 🔒 Authentication
Routes marked with a lock icon require a **Firebase ID Token (JWT)**.
1. Get a token from your Firebase Client SDK.
2. Click the **Authorize** button below.
3. Paste the token into the \`bearerAuth\` field.

### 📦 Response Wrappers
All responses follow a consistent envelope:
- **Success**: \`{ "success": true, "data": { ... }, "message": "Optional" }\`
- **Error**: \`{ "success": false, "error": { "code": "CODE", "message": "...", "details": { ... } } }\`
            `
        },
        tags: [
            { name: 'User', description: 'User related endpoints' },
            { name: 'Auth', description: 'Authentication related endpoints' },
            { name: 'Example', description: 'Example module demonstrating architecture and validation' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Firebase ID Token'
                }
            }
        }
    }
})
