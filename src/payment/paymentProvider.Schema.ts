import { Prop } from '@nestjs/mongoose';

export class PaymentProvider {
  @Prop({ required: true })
  name: string[];
}
