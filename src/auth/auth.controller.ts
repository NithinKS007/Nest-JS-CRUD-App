import { Controller, Post, Body, Inject, HttpStatus, HttpCode } from '@nestjs/common';
import { AUTH_SERVICE, type IAuthService } from './auth.interfaces';
import { SignInDto, SignUpDto } from 'src/user/users.dto';
import { User } from 'src/user/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}
  @Post('sign-up')
  async signUp(@Body() data: SignUpDto): Promise<Omit<User, 'password'>> {
    return this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(data: SignInDto): Promise<Omit<User, 'password'>> {
    return this.authService.signIn(data);
  }
}
