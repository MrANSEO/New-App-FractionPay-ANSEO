import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ActivityType } from 'src/common/enums/activity-type.enum';
import GenericEntity from 'src/common/schemas/generic.schema';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    versionKey: false,
  },
})
export class Activity extends GenericEntity {
  @Prop()
  type: ActivityType;

  @Prop()
  event: string;

  @Prop({ type: Object })
  payload: unknown;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
