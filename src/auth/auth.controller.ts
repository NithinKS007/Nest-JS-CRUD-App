import {
  Controller,
  Post,
  Inject,
  HttpStatus,
  UseGuards,
  Body,
  HttpCode,
  Version,
  Res,
} from '@nestjs/common';
import { AUTH_SERVICE, type IAuthService } from './auth.interfaces';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import {
  SignInDto,
  SignInResDto,
  SignUpDto,
  SignUpResDto,
} from 'src/user/users.dto';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-in')
  @Version('1')
  @ApiOperation({ summary: 'sign in user and return access token, user data' })
  @ApiResponse({
    status: 200,
    description: 'success.',
    type: SignInResDto,
  })
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInDto,
  ): Promise<SignInResDto>  {
    const mode = this.configService.get<string>('app.mode') === 'PRODUCTION';

    const { accessToken, refreshToken, userData } =
      await this.authService.signIn(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: mode ? 'none' : 'strict',
      secure: mode,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user: userData } as SignInResDto
  }

  @Post('sign-up')
  @Version('1')
  @ApiOperation({ summary: 'sign up user and return created user data' })
  @ApiResponse({ status: 201, description: 'success.', type: SignUpResDto })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: SignUpDto):Promise<SignUpResDto> {
    const userData = await this.authService.signUp(data);
    return { user: userData } as SignUpResDto
  }
}
