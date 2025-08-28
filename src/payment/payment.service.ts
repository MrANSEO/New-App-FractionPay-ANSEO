import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from 'src/payment/dto/update-payment.dto';
import { Payment, PaymentStatus } from './schemas/payment.schema';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentRepository } from './paymentRepository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = await this.repository.create(dto);

    await this.notificationService.sendMail(
      payment.payer.email,
      'Payment Pending',
      `Votre paiement de ${payment.amount} FCFA est en attente.`,
    );

    return payment;
  }

  findAll(): Promise<Payment[]> {
    return this.repository.findAll();
  }

  findOne(id: string): Promise<Payment> {
    return this.repository.findOne(id);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.repository.update(id, dto);

    if (dto.status === PaymentStatus.SUCCESS) {
      await this.notificationService.sendMail(
        payment.payer.email,
        'Payment Success',
        `Votre paiement de ${payment.amount} FCFA a été confirmé.`,
      );
    } else if (dto.status === PaymentStatus.FAILED) {
      await this.notificationService.sendMail(
        payment.payer.email,
        'Payment Failed',
        `Votre paiement de ${payment.amount} FCFA a échoué.`,
      );
    }

    return payment;
  }
}
