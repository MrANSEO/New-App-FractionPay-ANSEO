import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class UpdatePaymentStepDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  paypalOrderId?: string;

  @IsOptional()
  @IsString()
  paypalCaptureId?: string;

  @IsOptional()
  @IsObject()
  paypalLastPayload?: Record<string, unknown>;

  @IsOptional()
  paypalWebhookEvents?: string[];
}
