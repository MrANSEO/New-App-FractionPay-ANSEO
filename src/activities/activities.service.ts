import { Injectable } from '@nestjs/common';
import { ActivitiesRepository } from './activities.repository';
import { CreateActivityDto, GetActivitiesDto } from './dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}

  create(dto: CreateActivityDto) {
    return this.activitiesRepository.save({ ...dto });
  }

  async findMany(query: GetActivitiesDto) {
    const items = await this.activitiesRepository.findMany(
      GetActivitiesDto.buildResultsQuery(query),
    );
    const totalItems = await this.activitiesRepository.aggregateCount(
      GetActivitiesDto.buildCountQuery(query),
    );

    return {
      items,
      totalItems,
    };
  }

  findOne(id: string) {
    return this.activitiesRepository.findById(id);
  }
}
