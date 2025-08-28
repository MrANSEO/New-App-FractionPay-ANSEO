import { Prop } from '@nestjs/mongoose';
import { PaymentStatus } from './schemas/payment.schema';
import { PaymentProvider } from './paymentProvider.Schema';

export class PaymentStep {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, type: [String] })
  paymentProvider: PaymentProvider[];

  @Prop({ type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  status: PaymentStatus;
}
