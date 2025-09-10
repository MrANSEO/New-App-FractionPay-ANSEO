import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStep } from '../schemas/payment.schema';

export class PayerDto {
  @IsString()
  email: string;
}

export class PaymentStepDto {
  @IsString()
  paymentProvider: string;

  @IsNumber()
  amount: number;
  status: import('../schemas/payment.schema').PaymentStatus;
}

export class CreatePaymentDto {
  @IsString()
  paymentId: string;

  @ValidateNested()
  @Type(() => PayerDto)
  payer: PayerDto;

  @IsNumber()
  totalAmount: number;

  @ValidateNested({ each: true })
  @Type(() => PaymentStepDto)
  steps: PaymentStep[];
}
