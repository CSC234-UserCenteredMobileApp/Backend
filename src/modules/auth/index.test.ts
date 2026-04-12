import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { authController } from './index'
import { db } from '../../plugins/db'
import { errorHandler } from '../../plugins/error-handler'

describe('Auth Module', () => {
    const app = new Elysia()
        .use(errorHandler)
        .use(authController)
    const MOCK_UID = 'dev-user-123'
    const MOCK_EMAIL = 'dev@example.com'

    beforeAll(async () => {
        // Clean up mock user if exists
        await db.user.deleteMany({
            where: { firebaseUid: MOCK_UID }
        })
    })

    afterAll(async () => {
        // Clean up
        await db.user.deleteMany({
            where: { firebaseUid: MOCK_UID }
        })
    })

    it('POST /auth/sync should create/update user with dev-token', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/sync', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer dev-token',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: 'Test User' })
            })
        )

        const result = (await response.json()) as any
        
        expect(response.status).toBe(200)
        expect(result.success).toBe(true)
        expect(result.data.firebaseUid).toBe(MOCK_UID)
        expect(result.data.name).toBe('Test User')
        expect(result.data.email).toBe(MOCK_EMAIL)
    })

    it('GET /auth/me should retrieve the synced profile', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer dev-token'
                }
            })
        )

        const result = (await response.json()) as any

        expect(response.status).toBe(200)
        expect(result.success).toBe(true)
        expect(result.data.firebaseUid).toBe(MOCK_UID)
        expect(result.data.email).toBe(MOCK_EMAIL)
    })

    it('GET /auth/me should return 401 without token', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/me', {
                method: 'GET'
            })
        )

        expect(response.status).toBe(401)
    })
})
