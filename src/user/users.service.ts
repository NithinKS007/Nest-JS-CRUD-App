import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { PagedResponse, QueryParamsDto, SignUpDto } from './users.dto';
import type { IUserRepository, IUserService } from './user.interfaces';
import { USER_REPOSITORY } from './user.interfaces';
import type { IHashingService } from 'src/hashing/hashing.interface';
import { HASHING_SERVICE } from 'src/hashing/hashing.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async create(data: SignUpDto): Promise<User> {
    const hashedPassword = await this.hashingService.hash(data.password);
    return this.userRepo.create({ ...data, password: hashedPassword });
  }

  async findOne(data: User): Promise<User | null> {
    return this.userRepo.findOne(data);
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.userRepo.findById(id);

    if (!userData) {
      throw new NotFoundException('user not found');
    }

    return userData;
  }

  async findAll(data: QueryParamsDto): Promise<PagedResponse<User>> {
    return this.userRepo.findAll(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userRepo.update(id, data);
    if (!updatedUser) {
      throw new BadRequestException('Failed to update user');
    }
    return updatedUser;
  }
}
