import { Request } from 'express';
import type { Payload } from '../auth/jwt/jwt.interface';

export interface customReq extends Request {
  user?: Payload;
}
