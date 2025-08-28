import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const createCsrfProtection = (
  configService: ConfigService,
  jwtService: JwtService,
) => {
  const CSRF_SECRET = configService.get<string>('csrf.secret');
  const JWT_SECRET = configService.get<string>('jwt.accessTokenSecret');
  const isProd = configService.get<string>('app.mode') === 'PRODUCTION';

  if (!CSRF_SECRET || !JWT_SECRET) {
    throw new Error('CSRF or JWT secrets are not defined in environment');
  }

  return doubleCsrf({
    getSecret: () => CSRF_SECRET,
    getSessionIdentifier: (req: Request) => {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return '';
      const accessToken = authHeader.split(' ')[1];
      try {
        const decoded = jwtService.verify(accessToken, { secret: JWT_SECRET });
        return decoded?.sub || decoded?.id || '';
      } catch {
        return '';
      }
    },
    cookieName: '__Host-csrf',
    cookieOptions: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
  });
};
