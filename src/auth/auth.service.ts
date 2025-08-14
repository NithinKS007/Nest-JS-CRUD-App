import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/user/user.interfaces';
import type { IUserService } from 'src/user/user.interfaces';
import { SignUpDto, SignInDto } from 'src/user/users.dto';
import { User } from 'src/user/users.entity';
import { IAuthService } from './auth.interfaces';
import { HASHING_SERVICE } from 'src/hashing/hashing.interface';
import type { IHashingService } from 'src/hashing/hashing.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
  ) {}
  async signUp(data: SignUpDto): Promise<Omit<User, 'password'>> {
    const userData = await this.userService.create(data);
    const { password, ...otherDetails } = userData;
    return otherDetails;
  }

  async signIn(data: SignInDto): Promise<Omit<User, 'password'>> {
    const userData = await this.userService.findByEmail(data);
    if (!userData) {
      throw new NotFoundException(
        'Email not found, Please provide a valid email address',
      );
    }
    const { password, ...otherDetails } = userData;

    const comparedPassword = this.hashingService.compare(
      data.password,
      password,
    );

    if (!comparedPassword) {
      throw new UnauthorizedException(
        'Please enter a valid password and try again later',
      );
    }
    
    return otherDetails;
  }
}
