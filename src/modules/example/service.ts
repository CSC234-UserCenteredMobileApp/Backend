import { db } from '../../plugins/db';
import { NotFoundError } from '../../shared/errors';
import type { CreateExampleBody, UpdateExampleBody } from './model';

/**
 * Example Service
 * All business logic and database interactions should happen here.
 * This service is isolated from HTTP concepts like `req`, `res`, or `headers`.
 */
export class ExampleService {
  /**
   * Fetch all example items from the database.
   */
  async getAll() {
    // Replace 'example' with your actual Prisma model
    // return await db.example.findMany();
    
    // For this demonstration, we'll return a mock array
    return [
      { id: 1, name: 'Sample Item', description: 'This is a public item' },
      { id: 2, name: 'Another Item', description: 'Everyone can see this' },
    ];
  }

  /**
   * Fetch a single item by its ID.
   * Throws a NotFoundError if the item doesn't exist.
   */
  async getById(id: number) {
    // const item = await db.example.findUnique({ where: { id } });
    
    // Mocking a successful find for ID 1 and a failure for others
    if (id !== 1) {
      throw new NotFoundError(`Example item with ID ${id} not found`);
    }

    return { id: 1, name: 'Sample Item', description: 'Found it!' };
  }

  /**
   * Create a new item in the database.
   * Demonstrates processing data received from a protected route.
   */
  async create(data: CreateExampleBody, userId: string) {
    // In a real app, you might associate the item with the authenticated user
    /*
    return await db.example.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
    */

    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      createdBy: userId,
      status: 'Created successfully',
    };
  }
}

// Export a singleton instance of the service
export const exampleService = new ExampleService();
