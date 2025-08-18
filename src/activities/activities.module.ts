import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesRepository } from './activities.repository';
import { Activity, ActivitySchema } from './activity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
})
export class ActivitiesModule {}
