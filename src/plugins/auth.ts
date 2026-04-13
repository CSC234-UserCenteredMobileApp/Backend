import { Elysia } from 'elysia'
import { getApps } from './firebase'
import { getAuth } from 'firebase-admin/auth'
import { UnauthorizedError, AppError } from '../shared/errors'

export const authPlugin = new Elysia({ name: 'plugin.auth' })
  .derive({ as: 'scoped' }, async ({ headers }) => {
    const authorization = headers['authorization']
    
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedError('Authorization token is missing')
    }

    const token = authorization.substring(7).trim()

    // Development Bypass
    if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && token === 'dev-token') {
      return {
        user: {
          uid: 'dev-user-123',
          email: 'dev@example.com',
          email_verified: true,
          name: 'Development User',
          picture: 'https://placehold.co/400x400?text=Dev'
        }
      }
    }

    // Ensure Firebase is initialized
    if (getApps().length === 0) {
      console.error('Firebase Admin SDK: Not initialized. Check environment variables.')
      throw new AppError('Authentication service is currently unavailable', 500, 'FIREBASE_NOT_INITIALIZED')
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(token)
      
      return {
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          email_verified: decodedToken.email_verified,
          name: decodedToken.name,
          picture: decodedToken.picture
        }
      }
    } catch (error: any) {
      console.error('Firebase Auth Error:', error.message)
      throw new UnauthorizedError('Invalid or expired authorization token')
    }
  })
