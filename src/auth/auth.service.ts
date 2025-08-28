import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/user/user.interfaces';
import type { IUserService } from 'src/user/user.interfaces';
import { SignUpDto, SignInDto } from 'src/user/users.dto';
import { User } from 'src/user/users.entity';
import { IAuthService } from './auth.interfaces';
import { HASHING_SERVICE } from 'src/hashing/hashing.interface';
import type { IHashingService } from 'src/hashing/hashing.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createCsrfProtection } from 'src/shared/csrf.config';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(data: SignUpDto): Promise<Omit<User, 'password'>> {
    const { email } = data;
    const findExistingOne = await this.userService.findOne({ email });

    if (findExistingOne) {
      throw new ConflictException('Email already exists');
    }

    const userData = await this.userService.create(data);
    const { password, ...otherDetails } = userData;
    return otherDetails;
  }

  async validateUser(data: SignInDto): Promise<Omit<User, 'password'>> {
    const { email, password } = data;
    const userData = await this.userService.findOne({ email: email });

    if (!userData) {
      throw new NotFoundException(
        'Email not found, Please provide a valid email account',
      );
    }

    if (userData.isBlocked) {
      throw new UnauthorizedException(
        'Your account has now been blocked , Please try again',
      );
    }

    const isMatch = await this.hashingService.compare(
      password,
      userData.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Please enter a valid password and try again later',
      );
    }
    const { password: _, ...result } = userData;

    return result;
  }

  async signIn(data: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: Omit<User, 'password'>;
  }> {
    const userData = await this.validateUser(data);
    const tokens = await this.generateTokens(userData);
    return { ...tokens, userData };
  }

  private async generateTokens(user: Omit<User, 'password'>) {
    const payload = { id: user.id, role: user.role };
    const accessToken = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
    });

    const refreshToken = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  async changePassword(data: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    const { oldPassword, newPassword, userId } = data;

    const userData = await this.userService.findById(userId);

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await this.hashingService.compare(
      oldPassword,
      userData.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect old password');
    }

    const updatedPassword = await this.userService.update(userData.id, {
      password: newPassword,
    });

    if (!updatedPassword) {
      throw new BadRequestException('Failed to update password');
    }
  }
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new ForbiddenException(
        'Refresh token not found, Please try again later',
      );
    }
    const decoded = await this.jwtservice.verifyAsync(refreshToken);

    const newAccessToken = await this.jwtservice.signAsync(
      { id: decoded.id, role: decoded.role },
      {
        secret: this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
      },
    );

    return { accessToken: newAccessToken };
  }

  // async generateCsrfToken(): Promise<string> {
  //   const { generateCsrfToken } = createCsrfProtection(
  //     this.configService,
  //     this.jwtservice,
  //   );

  //   const token = generateCsrfToken()
  // }
}
