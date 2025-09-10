import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { UpdatePaymentStepDto } from '../dto/update-payment-step.dto';
import { Payment } from '../schemas/payment.schema';
import { PaymentProvider } from '../enums/paymentProvider.Schema';

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

  @Patch(':id/steps/:provider')
  async updateStep(
    @Param('id') id: string,
    @Param('provider') provider: string,
    @Body() dto: UpdatePaymentStepDto,
  ) {
    if (!Object.values(PaymentProvider).includes(provider as PaymentProvider)) {
      throw new BadRequestException(`Provider invalide: ${provider}`);
    }
    return this.paymentService.updateStep(id, provider as PaymentProvider, dto);
  }
}
