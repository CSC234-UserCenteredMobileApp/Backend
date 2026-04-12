import { Elysia } from 'elysia'
import { firebaseAdmin } from './firebase'
import { UnauthorizedError } from '../shared/errors'

export const authPlugin = new Elysia({ name: 'plugin.auth' })
  .derive({ as: 'scoped' }, async ({ headers }) => {
    const authorization = headers['authorization']
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization token is missing')
    }

    const token = authorization.split('Bearer ')[1]

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

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
      
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
