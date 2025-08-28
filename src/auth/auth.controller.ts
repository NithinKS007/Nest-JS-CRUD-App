import {
  Controller,
  Post,
  Inject,
  HttpStatus,
  Body,
  HttpCode,
  Version,
  Res,
  Patch,
} from '@nestjs/common';
import { AUTH_SERVICE, type IAuthService } from './auth.interfaces';
import type { Response } from 'express';
import {
  SignInDto,
  SignInResDto,
  SignUpDto,
  SignUpResDto,
} from 'src/user/users.dto';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomApiResponse,
  SignInSwaggerDoc,
  SignUpSwaggerDoc,
} from 'src/shared/decorators/swagger.doc.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-in')  
  @Version('1')
  @SignInSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInDto,
  ): Promise<CustomApiResponse<SignInResDto>> {
    const mode = this.configService.get<string>('app.mode') === 'PRODUCTION';

    const { accessToken, refreshToken, userData } =
      await this.authService.signIn(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: mode ? 'none' : 'strict',
      secure: mode,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
     return {
      message: 'Successfully signed in',
      data: { accessToken, user: userData },
    };
  }

  @Post('sign-up')
  @Version('1')
  @SignUpSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: SignUpDto): Promise<CustomApiResponse<SignUpResDto>> {
    const userData = await this.authService.signUp(data);
   return {
      message: 'User registered successfully',
      data: { user: userData },
    };
  }

  // @Patch('change-password')
  // @Version('1')
  // @HttpCode(HttpStatus.OK)
  // async changePassword(
  //   @Body() data: { oldPassword: string; newPassword: string },
  // ): Promise<void> {
  //   await this.authService.changePassword(data);
  // }
}
