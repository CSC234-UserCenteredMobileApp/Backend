import { t, type Static } from 'elysia'

export const UploadFileBodySchema = t.Object({
  file: t.File({
    description: "File to upload",
    maxSize: '5m',
    type: ['image/jpeg', 'image/png', 'image/webp']
  })
})

export type UploadFileBody = Static<typeof UploadFileBodySchema>

export interface UploadResult {
  url: string
  path: string
}
