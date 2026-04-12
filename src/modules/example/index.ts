import { Elysia } from 'elysia';
import { authPlugin } from '../../plugins/auth';
import { successResponse } from '../../shared/response';
import { exampleService } from './service';
import { GetExampleParams, CreateExampleBody } from './model';

/**
 * Example Module Controller
 * Defines all API routes for the 'example' domain.
 * Demonstrates public and protected routes with TypeBox validation.
 */
export const exampleController = new Elysia({ 
  prefix: '/example',
  detail: {
    tags: ['Example'], // Organizing routes in Swagger UI
  }
})
  // --- Public Routes ---
  
  /**
   * Get all items (Public)
   */
  .get('/', async () => {
    const data = await exampleService.getAll();
    return successResponse(data, 'Items fetched successfully');
  })

  /**
   * Get a single item by ID (Public)
   * Validation: Params must match GetExampleParams (id is a number >= 1)
   */
  .get('/:id', async ({ params }) => {
    const data = await exampleService.getById(params.id);
    return successResponse(data);
  }, {
    params: GetExampleParams,
  })

  // --- Protected Routes ---

  /**
   * Protected scope: Everything inside this guard requires a Firebase JWT
   */
  .guard({
    detail: {
      security: [{ BearerAuth: [] }], // Informs Swagger that this route needs a token
    }
  }, (app) => app
    .use(authPlugin) // Middleware to verify Firebase JWT and inject 'user' into context

    /**
     * Create a new item (Protected)
     * Access: Only authenticated users
     * Validation: Body must match CreateExampleBody
     */
    .post('/', async ({ body, user }) => {
      // 'user' is injected by the authPlugin and contains the Firebase UID and email
      const data = await exampleService.create(body, user.uid);
      
      return successResponse(data, 'New example item created successfully');
    }, {
      body: CreateExampleBody,
    })

    /**
     * Delete an item (Protected)
     * Demonstrates using params in a protected route
     */
    .delete('/:id', async ({ params, user }) => {
      // In a real app, you'd check if 'user.uid' owns the item before deleting
      return successResponse(null, `Deleted item ${params.id} as user ${user.email}`);
    }, {
      params: GetExampleParams,
    })
  );
