import { Elysia } from 'elysia'
import { StorageService } from './service'
import { UploadFileBodySchema } from './model'
import { authPlugin } from '../../plugins/auth'
import { successResponse } from '../../shared/response'

const storageService = new StorageService()

export const storageController = new Elysia({ prefix: '/storage' })
  .guard({}, (app) => app
    .use(authPlugin)
    .post('/upload', async ({ body }) => {
      const result = await storageService.uploadFile(body.file)
      return successResponse(result, "File uploaded successfully")
    }, {
      body: UploadFileBodySchema,
      detail: {
        summary: "Upload image",
        description: "Upload an image to Supabase Storage",
        tags: ['Storage']
      }
    })
  )
