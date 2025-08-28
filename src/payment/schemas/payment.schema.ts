import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Application } from 'src/application/schemas/application.schema';
import { Payer } from '../payer.schema';
import { PaymentStep } from '../paymenSteps.Schema';

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({ type: Object })
  payer: Payer;

  @Prop({ type: [String] })
  steps: PaymentStep[];

  @Prop({ type: Object })
  application: Application;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
