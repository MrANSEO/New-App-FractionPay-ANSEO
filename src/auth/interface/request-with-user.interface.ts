import { Request } from 'express';
import { FullUserRecord } from '../../users/user.schema';

export interface RequestWithUser extends Request {
  user?: FullUserRecord;
}
