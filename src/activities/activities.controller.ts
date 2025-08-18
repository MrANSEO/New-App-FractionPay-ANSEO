import { Controller, Get, Param, Query } from '@nestjs/common';

import { Credentials } from '../auth/decorators/credentials.decorator';
import { UserCredential } from '../common/enums/user-credential.enum';
import { ActivitiesService } from './activities.service';
import { GetActivitiesDto } from './dto/get-activities.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Credentials(UserCredential.ACTIVITIES_READ)
  @Get()
  findMany(@Query() query: GetActivitiesDto) {
    return this.activitiesService.findMany(query);
  }

  @Credentials(UserCredential.ACTIVITIES_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }
}
