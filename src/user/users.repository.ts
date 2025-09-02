import { BaseRepository } from 'src/shared/baseRepositoy';
import { User, UserDocument } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from './user.interfaces';
import { MongooseFilter, PagedResponse, QueryParamsDto } from './users.dto';

export class UserRepository
  extends BaseRepository<UserDocument, User>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
  
  async findAll(data: QueryParamsDto): Promise<PagedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      status,
      role,
      search,
      sortBy = 'createdAt',
    } = data;

    const filter: MongooseFilter<UserDocument> = {};

    if (role) {
      filter.role = role;
    }

    const filterMap: MongooseFilter<UserDocument> = {
      Block: { isBlocked: true },
      Unblock: { isBlocked: false },
    };

    const conditions =
      status
        ?.filter((stat) => stat !== 'All' && stat in filterMap)
        .map((filter) => filterMap[filter]) ?? [];

    if (conditions.length > 0) filter.$and = conditions;

    if (search) {
      const fields = ['fName', 'lName', 'email'];
      filter.$or = fields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sortBy]: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    const toDomainList = users.map((user) => this.toDomain(user));

    return {
      data: toDomainList,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
