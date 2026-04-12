import { Elysia } from 'elysia'
import { AuthService } from './service'
import { SyncUserBodySchema } from './model'
import { authPlugin } from '../../plugins/auth'
import { successResponse } from '../../shared/response'

const authService = new AuthService()

export const authController = new Elysia({ prefix: '/auth' })
    .guard({}, (app) => app
        .use(authPlugin)
        .post('/sync', async ({ user, body }) => {
            const result = await authService.syncUser(user, body)
            return successResponse(result, "Profile synced successfully")
        }, {
            body: SyncUserBodySchema,
            detail: {
                summary: "Sync user profile",
                description: "Synchronize Firebase user data with local database",
                tags: ['Auth']
            }
        })
        .get('/me', async ({ user }) => {
            const profile = await authService.getProfile(user.uid)
            return successResponse(profile, "Profile retrieved successfully")
        }, {
            detail: {
                summary: "Get current user profile",
                description: "Retrieve your local application profile using verified identity",
                tags: ['Auth']
            }
        })
    )
