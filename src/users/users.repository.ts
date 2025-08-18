import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import GenericRepository from '../common/repository/generic.repository';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository extends GenericRepository<User> {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>) {
    super(UserModel);
  }
}
