import {
  Controller,
  Post,
  Inject,
  HttpStatus,
  UseGuards,
  Req,
  Body,
  HttpCode,
  Version,
} from '@nestjs/common';
import { AUTH_SERVICE, type IAuthService } from './auth.interfaces';
import { User } from 'src/user/users.entity';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { SignUpDto } from 'src/user/users.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-in')
  @Version('1')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request, res: Response) {
    const user = req.user;
    const mode = this.configService.get<string>('app.mode') === 'PRODUCTION';
    const { accessToken, refreshToken, userData } =
      await this.authService.signIn(user as User);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: mode ? 'none' : 'strict',
      secure: mode,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user: userData };
  }

  @Post('sign-up')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: SignUpDto) {
    const userData = await this.authService.signUp(data);
    return { user: userData };
  }
}
