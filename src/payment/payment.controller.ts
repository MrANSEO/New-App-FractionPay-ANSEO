import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './schemas/payment.schema';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(dto);
  }

  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentService.update(id, dto);
  }
}
