import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

// Errors also follow the Standard Envelope shape (success: false) so frontend
// and Core-side tooling only ever parse one response shape.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : undefined;
    const responseObject =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse as { message?: unknown }
        : undefined;
    const validationDetails = Array.isArray(responseObject?.message)
      ? responseObject.message.map(String)
      : undefined;
    const message =
      status >= 500
        ? 'Internal server error'
        : validationDetails
          ? 'Request validation failed'
          : typeof exceptionResponse === 'string'
            ? exceptionResponse
            : typeof responseObject?.message === 'string'
              ? responseObject.message
              : 'Request failed';
    const code =
      status === 400
        ? validationDetails ? 'VALIDATION_ERROR' : 'BAD_REQUEST'
        : status === 401
          ? 'UNAUTHORIZED'
          : status === 403
            ? 'FORBIDDEN'
            : status === 404
              ? 'NOT_FOUND'
              : status === 409
                ? 'CONFLICT'
                : status === 429
                  ? 'TOO_MANY_REQUESTS'
                  : status === 503
                    ? 'SERVICE_UNAVAILABLE'
                    : 'INTERNAL_ERROR';

    if (status === 429 || status === 503) {
      response.setHeader('Retry-After', '1');
    }

    // Unexpected (non-HttpException) errors are hidden from the client, so they
    // MUST be logged here or the real cause (e.g. a missing DB table) is invisible.
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      success: false,
      data: null,
      meta: {},
      error: {
        code,
        status_code: status,
        message,
        ...(validationDetails ? { details: validationDetails } : {}),
      },
    });
  }
}
