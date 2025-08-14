import { Inject, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { SignInDto, SignUpDto } from './users.dto';
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

  async findByEmail(data: SignInDto): Promise<User | null> {
    const { email } = data;
    return this.userRepo.findOne({ email: email });
  }
}
