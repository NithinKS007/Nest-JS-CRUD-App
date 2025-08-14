import { BaseRepository } from 'src/shared/baseRepositoy';
import { User, UserDocument } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRepository extends BaseRepository<UserDocument, User> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
}
