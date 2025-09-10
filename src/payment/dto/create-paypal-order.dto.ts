import { IsString, IsNumber, Min } from 'class-validator';

export class CreatePaypalOrderDto {
  @IsString()
  paymentId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
