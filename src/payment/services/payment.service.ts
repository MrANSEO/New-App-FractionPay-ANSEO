import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { UpdatePaymentStepDto } from '../dto/update-payment-step.dto';
import { Payment } from '../schemas/payment.schema';
import { PaymentStatus } from '../schemas/payment.schema';
import { PaymentProvider } from '../enums/paymentProvider.Schema';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentRepository } from '../ repositories/paymentRepository';

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
      'Paiement en attente',
      `Votre paiement de ${payment.totalAmount} € est en attente.`,
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

    if (dto.steps) {
      for (const step of dto.steps) {
        if (step.status === PaymentStatus.SUCCESS) {
          await this.notificationService.sendMail(
            payment.payer.email,
            'Paiement réussi',
            `Votre paiement via ${step.paymentProvider} a été confirmé.`,
          );
        } else if (step.status === PaymentStatus.FAILED) {
          await this.notificationService.sendMail(
            payment.payer.email,
            'Paiement échoué',
            `Votre paiement via ${step.paymentProvider} a échoué.`,
          );
        }
      }
    }

    return payment;
  }

  async updateStep(
    id: string,
    provider: PaymentProvider,
    updates: UpdatePaymentStepDto,
  ): Promise<Payment> {
    const payment = await this.repository.updateStep(id, provider, updates);

    if (updates.status === PaymentStatus.SUCCESS || updates.status === PaymentStatus.FAILED) {
      await this.notificationService.sendMail(
        payment.payer.email,
        `Paiement ${updates.status.toLowerCase()}`,
        `Votre paiement via ${provider} est maintenant ${updates.status.toLowerCase()}.`,
      );
    }

    return payment;
  }
}
