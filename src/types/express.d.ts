import type { Payload } from 'src/auth/jwt/jwt.interface';

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
    }
  }
}
