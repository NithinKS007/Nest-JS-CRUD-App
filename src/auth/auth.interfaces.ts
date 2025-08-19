import { SignUpDto } from 'src/user/users.dto';
import { User } from 'src/user/users.entity';

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

export interface IAuthService {
  signUp(data: SignUpDto): Promise<Omit<User, 'password'>>;
  signIn(userData:Omit<User,"password">): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: Omit<User, 'password'>;
  }>;
}
