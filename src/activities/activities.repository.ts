import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import GenericRepository from '../common/repository/generic.repository';
import { Activity, ActivityDocument } from './activity.schema';

@Injectable()
export class ActivitiesRepository extends GenericRepository<Activity> {
  constructor(
    @InjectModel(Activity.name)
    private readonly ActivityModel: Model<ActivityDocument>,
  ) {
    super(ActivityModel);
  }
}
