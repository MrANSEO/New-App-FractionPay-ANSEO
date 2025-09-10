import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStep } from '../schemas/payment.schema';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  steps?: PaymentStep[];
}
