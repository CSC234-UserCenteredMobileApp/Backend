import { db } from '../../plugins/db'
import type { SyncUserBody, AuthUser } from './model'
import { NotFoundError, ValidationError } from '../../shared/errors'

export class AuthService {
    /**
     * Syncs a Firebase user with the local database.
     * Upserts the user record based on the firebaseUid.
     */
    async syncUser(
        firebaseUser: { uid: string; email?: string; name?: string },
        additionalData: SyncUserBody
    ): Promise<AuthUser> {
        const { uid, email, name: fbName } = firebaseUser

        if (!email) {
            throw new ValidationError('Email is required from Firebase token to sync profile')
        }

        try {
            const user = await db.user.upsert({
                where: { firebaseUid: uid },
                update: {
                    name: additionalData.name || fbName || undefined
                },
                create: {
                    firebaseUid: uid,
                    email: email,
                    name: additionalData.name || fbName || null
                }
            })

            return user as AuthUser
        } catch (error: any) {
            // Handle Prisma unique constraint violation (P2002)
            if (error.code === 'P2002') {
                const target = error.meta?.target || []
                if (target.includes('email')) {
                    throw new ValidationError('This email address is already registered to a different account')
                }
            }
            throw error
        }
    }

    /**
     * Retrieves the local profile for a given Firebase UID.
     */
    async getProfile(firebaseUid: string): Promise<AuthUser> {
        const user = await db.user.findUnique({
            where: { firebaseUid }
        })

        if (!user) {
            throw new NotFoundError('User profile not found. Please sync your account.')
        }

        return user as AuthUser
    }
}
