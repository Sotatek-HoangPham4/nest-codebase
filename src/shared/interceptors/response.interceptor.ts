import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Normalize domain entities → plain objects
        const normalized = this.normalize(data);

        let responseData: any = undefined;
        if (
          normalized &&
          (typeof normalized !== 'object' ||
            !('message' in normalized) ||
            Object.keys(normalized).length > 1)
        ) {
          responseData = normalized?.data ?? normalized;
        }

        const response = {
          status: 'success',
          message: data?.message || '',
          ...(responseData !== undefined ? { data: responseData } : {}),
          timestamp: new Date().toISOString(),
        };

        this.logger.log(`[Response] ${JSON.stringify(response)}`);

        return response;
      }),
    );
  }

  /**
   * Convert domain entities to plain objects using getProps() if available.
   * Supports:
   * - Single object
   * - Arrays of objects
   * - Nested objects
   */
  private normalize(value: any): any {
    if (!value) return value;

    // Case 1: If domain entity has getProps() → flatten
    if (typeof value.getProps === 'function') {
      return value.getProps();
    }

    // Case 2: Array → normalize each item
    if (Array.isArray(value)) {
      return value.map((v) => this.normalize(v));
    }

    // Case 3: Plain object with nested potential domain objects
    if (typeof value === 'object') {
      const normalizedObject: any = {};
      for (const key of Object.keys(value)) {
        normalizedObject[key] = this.normalize(value[key]);
      }
      return normalizedObject;
    }

    // Other primitive values → return as-is
    return value;
  }
}
