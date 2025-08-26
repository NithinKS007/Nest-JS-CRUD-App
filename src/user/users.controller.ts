import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { USER_SERVICE, type IUserService } from './user.interfaces';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import type { customReq } from 'src/types/express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResDto } from './users.dto';

@ApiTags('auth')
@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: 'user details fetched successfully.' })
  @ApiResponse({ status: 200, description: 'success.', type: UserResDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('id') id: string,
    @Req() req: customReq,
  ): Promise<Omit<User, 'password'> | null> {
    const userId = req?.user?.id || req.params.id;
    const userData = await this.userService.findById(userId);
    return userData;
  }
}
