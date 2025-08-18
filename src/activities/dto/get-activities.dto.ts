import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PipelineStage } from 'mongoose';
import { GetPaginatedEntities } from '../../common/dto/get-paginated-entities';
import { ActivityType } from '../../common/enums/activity-type.enum';

export class GetActivitiesDto extends GetPaginatedEntities {
  @IsOptional()
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsOptional()
  @IsString()
  event?: string;

  static buildCountQuery(dto: GetActivitiesDto): PipelineStage.Match {
    const query: PipelineStage.Match['$match'] = {};

    if (dto.event) {
      query['event'] = dto.event;
    }

    if (dto.type) {
      query['type'] = dto.type;
    }

    return { $match: query };
  }
}
