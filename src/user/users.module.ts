import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { User, UserSchema } from './users.entity';
import { UserRepository } from './users.repository';
import { USER_REPOSITORY, USER_SERVICE } from './user.interfaces';
import { HashingModule } from 'src/hashing/hash.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashingModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
  ],
  exports: [USER_SERVICE],
})
export class UsersModule {}
