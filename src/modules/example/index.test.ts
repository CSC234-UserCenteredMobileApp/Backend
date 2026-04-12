import { describe, it, expect, mock } from 'bun:test';

// 1. Mock the Firebase Admin plugin before importing the application components
// This prevents the tests from making actual network requests to Firebase.
mock.module('../../plugins/firebase', () => ({
  firebaseAdmin: {
    auth: () => ({
      verifyIdToken: async (token: string) => {
        if (token === 'valid-token') {
          // Return a mock decoded Firebase token
          return { uid: 'user123', email: 'test@example.com' };
        }
        throw new Error('Invalid token');
      }
    })
  }
}));

import { Elysia } from 'elysia';
import { exampleController } from './index';
import { errorHandler } from '../../plugins/error-handler';

// 2. Set up the test app
// We mount the error handler just like in src/index.ts so we can test 404s and Validation Errors
const app = new Elysia()
  .use(errorHandler)
  .use(exampleController);

describe('Example Module', () => {
  
  describe('GET /example/', () => {
    it('should return a list of items successfully', async () => {
      const response = await app.handle(new Request('http://localhost/example/'));
      const body = await response.json();
      
      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /example/:id', () => {
    it('should return a single item when a valid ID is provided', async () => {
      const response = await app.handle(new Request('http://localhost/example/1'));
      const body = await response.json();
      
      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(1);
    });

    it('should return 404 (Not Found) if the item does not exist', async () => {
      const response = await app.handle(new Request('http://localhost/example/999'));
      const body = await response.json();
      
      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 (Validation Error) for a non-numeric ID parameter', async () => {
      const response = await app.handle(new Request('http://localhost/example/abc'));
      const body = await response.json();
      
      // Our custom error handler returns 400 for validation errors
      expect(response.status).toBe(400); 
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /example/', () => {
    it('should successfully create an item when authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/example/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token' // Our mock allows this
        },
        body: JSON.stringify({ name: 'Test Item', description: 'Test description' })
      }));
      const body = await response.json();
      
      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Test Item');
      // Verify that the user UID from the mock token was correctly injected into the service
      expect(body.data.createdBy).toBe('user123'); 
    });

    it('should return 401 (Unauthorized) when the token is missing', async () => {
      const response = await app.handle(new Request('http://localhost/example/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Test Item' })
      }));
      
      const body = await response.json();
      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 (Unauthorized) when the token is invalid', async () => {
      const response = await app.handle(new Request('http://localhost/example/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token'
        },
        body: JSON.stringify({ name: 'Test Item' })
      }));
      
      const body = await response.json();
      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 (Validation Error) if the request body is invalid', async () => {
      const response = await app.handle(new Request('http://localhost/example/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        // The 'name' field requires minLength: 3, so 'A' will trigger a TypeBox validation error
        body: JSON.stringify({ name: 'A' }) 
      }));
      
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
