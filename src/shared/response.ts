import { t } from 'elysia';

// TypeBox Schema definitions for documentation and validation
// Using any for dataSchema to avoid narrow constraint issues with TArray/TObject/etc.
export const StandardResponseSchema = (dataSchema: any) => t.Object({
  success: t.Literal(true),
  data: dataSchema,
  message: t.Optional(t.String()),
});

export const ErrorResponseSchema = t.Object({
  success: t.Literal(false),
  error: t.Object({
    code: t.String(),
    message: t.String(),
    details: t.Optional(t.Any())
  })
});

// Helper functions for returning values
export const successResponse = <T>(data: T, message?: string) => ({
  success: true as const,
  data,
  ...(message && { message })
});

export const errorResponse = (code: string, message: string, details?: any) => ({
  success: false as const,
  error: { code, message, details }
});
