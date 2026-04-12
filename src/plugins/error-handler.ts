import { Elysia } from 'elysia';
import { AppError } from '../shared/errors';
import { errorResponse } from '../shared/response';

export const errorHandler = new Elysia({ name: 'plugin.error-handler' })
  .onError({ as: 'global' }, ({ code, error, set }) => {
    // Handle Elysia's built-in Validation error
    if (code === 'VALIDATION') {
      const response = errorResponse('VALIDATION_ERROR', 'Invalid request parameters', error.all);
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle Custom AppErrors
    if (error instanceof AppError || (error as any).name === 'AppError') {
      const appError = error as AppError;
      const response = errorResponse(appError.errorCode, appError.message, appError.details);
      return new Response(JSON.stringify(response), {
        status: appError.statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle unknown errors (Internal Server Error)
    console.error('Unhandled Error:', error);
    const response = errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  });
