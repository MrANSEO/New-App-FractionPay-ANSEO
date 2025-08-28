import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentRepository } from './paymentRepository';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  providers: [PaymentService, PaymentRepository, NotificationService],
  controllers: [PaymentController],
  exports: [PaymentService, NotificationService],
})
export class PaymentModule {}
