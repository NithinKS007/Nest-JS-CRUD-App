import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_SERVICE, type IUserService } from 'src/user/user.interfaces';
import { Payload } from './jwt.interface';
import { User } from 'src/user/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('jwt.accessTokenSecret');
    if (!secret || typeof secret !== 'string') {
      throw new Error(
        'JWT secret is not defined or invalid in the configuration',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: Payload): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Invalid token, Please try again');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(
        'Your account has now been blocked , Please try again',
      );
    }

    return user;
  }
}
