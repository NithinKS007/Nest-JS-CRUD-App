import { IBaseRepository } from 'src/shared/Ibase.repository';
import { User, UserDocument } from './users.entity';
import { SignInDto, SignUpDto } from './users.dto';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserRepository extends IBaseRepository<UserDocument, User> {}

export interface IUserService {
  create(data: SignUpDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findOne(data: Partial<User>): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
}
