import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentStepDto } from '../dto/update-payment-step.dto';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { PaymentProvider } from '../enums/paymentProvider.Schema';

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel(Payment.name) private model: Model<PaymentDocument>) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.model(dto);
    return payment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.model.findOne({ paymentId: id }).exec();
    if (!payment) {
      throw new NotFoundException(`Paiement ${id} non trouvé`);
    }
    return payment;
  }

  async update(id: string, dto: Partial<Payment>): Promise<Payment> {
    const updated = await this.model.findOneAndUpdate({ paymentId: id }, dto, { new: true }).exec();

    if (!updated) {
      throw new NotFoundException(`Paiement ${id} non trouvé`);
    }

    return updated;
  }

  async updateStep(
    id: string,
    provider: PaymentProvider,
    updates: UpdatePaymentStepDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    const step = payment.steps.find((s) => s.paymentProvider === provider);
    if (!step) {
      throw new NotFoundException(`Étape non trouvée pour ${provider}`);
    }

    Object.assign(step, updates);
    payment.markModified('steps');

    const updated = await this.model
      .findOneAndUpdate({ paymentId: id }, payment, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Paiement ${id} non trouvé après mise à jour`);
    }

    return updated;
  }
}
