import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

// Wraps every successful response in the Standard Envelope required by
// api-conventions.md: { success, data, meta }. Controllers just return plain
// data (or { data, meta } to set custom meta, e.g. pagination).
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
          return { success: true, data: payload.data, meta: payload.meta };
        }
        return { success: true, data: payload, meta: {} };
      }),
    );
  }
}
