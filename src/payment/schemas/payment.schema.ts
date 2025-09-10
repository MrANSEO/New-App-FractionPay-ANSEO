import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentProvider } from '../enums/paymentProvider.Schema';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class Payer {
  @Prop({ required: true })
  email: string;
}

export class PaymentStep {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentProvider })
  paymentProvider: PaymentProvider;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop()
  paypalOrderId?: string;

  @Prop()
  paypalCaptureId?: string;

  @Prop({ type: Object })
  paypalLastPayload?: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  paypalWebhookEvents?: string[];
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true, index: true, unique: true })
  paymentId: string;

  @Prop({ type: Payer, required: true })
  payer: Payer;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: [PaymentStep], required: true })
  steps: PaymentStep[];

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
export type PaymentDocument = Payment & Document;

PaymentSchema.index({ 'payer.email': 1 });
