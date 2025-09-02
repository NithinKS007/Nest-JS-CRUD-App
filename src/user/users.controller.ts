import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { USER_SERVICE, type IUserService } from './user.interfaces';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import type { customReq } from 'src/types/express';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomApiResponse,
  FindUserByIdDoc,
} from 'src/shared/decorators/swagger.doc.decorator';
import { QueryParamsDto } from './users.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get(':id')
  @Version('1')
  @FindUserByIdDoc()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('id') id: string,
    @Req() req: customReq,
  ): Promise<CustomApiResponse<Omit<User, 'password'> | null>> {
    const userId = req?.user?.id || req.params.id;
    const userData = await this.userService.findById(userId);
    return { data: userData, message: 'User found successfully' };
  }

  @Get()
  @Version('1')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryParamsDto,
  ): Promise<
    CustomApiResponse<{ data: User[]; totalPages: number; currentPage: number }>
  > {
    const { data, totalPages, currentPage } =
      await this.userService.findAll(query);
    return {
      data: {
        data,
        totalPages,
        currentPage,
      },
      message: 'Users details fetched successfully',
    };
  }
}
