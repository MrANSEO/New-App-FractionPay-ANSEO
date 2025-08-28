import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus, {
    message: 'Status must be one of: PENDING, SUCCESS, FAILED',
  })
  status: PaymentStatus;
}
