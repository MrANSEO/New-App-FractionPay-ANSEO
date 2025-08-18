import { ActivityType } from '../../common/enums/activity-type.enum';

export type CreateActivityDto = {
  type: ActivityType;

  event: string;

  payload: unknown;
};
