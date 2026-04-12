import { t, type Static } from 'elysia'

export const SyncUserBodySchema = t.Object({
    name: t.Optional(t.String({
        description: "Display name if not provided by Firebase",
        example: "John Doe"
    }))
})

export type SyncUserBody = Static<typeof SyncUserBodySchema>

export interface AuthUser {
    id: number
    firebaseUid: string
    email: string
    name: string | null
}
