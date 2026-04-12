import { t, type Static } from 'elysia';

/**
 * TypeBox schemas for the Example module.
 * These are used for both runtime validation and TypeScript type inference.
 */

// Schema for fetching an item by ID
export const GetExampleParams = t.Object({
  id: t.Numeric({
    description: 'The unique ID of the example item',
    minimum: 1,
  }),
});

// Schema for creating a new item
export const CreateExampleBody = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 50,
    error: 'Name must be between 3 and 50 characters',
  }),
  description: t.Optional(t.String({ maxLength: 255 })),
});

// TypeScript Types inferred from the schemas
export type GetExampleParams = Static<typeof GetExampleParams>;
export type CreateExampleBody = Static<typeof CreateExampleBody>;
