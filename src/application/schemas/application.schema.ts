import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  config: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  responsibleAdmin?: Types.ObjectId;
}

export const AppSchema = SchemaFactory.createForClass(Application);
