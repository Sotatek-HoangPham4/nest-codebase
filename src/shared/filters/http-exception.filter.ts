import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('[ExceptionFilter]', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;

    // Chuẩn hóa lỗi để an toàn với nhiều dạng trả về từ NestJS
    const normalizedError = this.normalizeError(exceptionResponse);

    // Tạo response theo BaseErrorResponse và ép kiểu rõ ràng
    const errorResponse: ErrorResponse = {
      status: 'error',
      error: {
        code: status,
        message: normalizedError.message,
      },
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private normalizeError(error: any) {
    if (typeof error === 'string') {
      return { message: error };
    }
    if (Array.isArray(error)) {
      return { message: error.join(', ') };
    }
    return {
      message: error.message || 'Internal server error',
      code: error.code,
    };
  }
}
