import { Elysia } from 'elysia'
import { authController } from './modules/auth'
import { storageController } from './modules/storage'
import { exampleController } from './modules/example'
import { errorHandler } from './plugins/error-handler'
import { swaggerPlugin } from './plugins/swagger'
import { cors } from '@elysiajs/cors';
const app = new Elysia()
  // Global plugins
  .use(cors())
  .use(swaggerPlugin)
  .use(errorHandler)
  // Register feature modules
  .group('/apiv1', app =>
    app
      .use(authController)
      .use(storageController)
      .use(exampleController)
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(`🚀 Supabase & Prisma integration ready.`)
console.log(`📖 Swagger documentation is available at http://${app.server?.hostname}:${app.server?.port}/swagger`)
