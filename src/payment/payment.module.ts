import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentController } from './controllers/payment.controller';
import { PaypalController } from './controllers/paypal.controller';
import { PaymentService } from './services/payment.service';
import { PaypalService } from './services/paypal.service';
import { PaymentRepository } from './ repositories/paymentRepository';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  controllers: [PaymentController, PaypalController],
  providers: [PaymentService, PaypalService, PaymentRepository, NotificationService],
  exports: [PaymentService, PaypalService],
})
export class PaymentModule {}
