import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string | null
  data: T | null
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;
    const success = statusCode >= 200 && statusCode < 300;

    return next.handle().pipe(
      map((response) => ({
        success,
        statusCode,
        message: (response && response.message) || null,
        data: (response && response.data) || null,
      })),
    );
  }
}
