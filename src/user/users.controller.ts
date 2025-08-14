import { Controller } from '@nestjs/common';
import type { IUserService } from './user.interfaces';
import { User } from './users.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: IUserService) {}
}
