import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from 'src/payment/dto/update-payment.dto';
import { PaymentDocument, Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel(Payment.name) private readonly model: Model<PaymentDocument>) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.model(dto);
    return payment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.model.findById(id).exec();
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Payment ${id} not found`);
    return updated;
  }
}
