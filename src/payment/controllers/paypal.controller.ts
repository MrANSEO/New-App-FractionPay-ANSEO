/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Headers,
  Body,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaypalService } from '../services/paypal.service';
import { PaymentService } from '../services/payment.service';
import { PaymentStatus } from '../schemas/payment.schema';
import { PaymentProvider } from '../enums/paymentProvider.Schema';
import { PayPalWebhookEvent, PayPalWebhookHeaders } from '../types/paypal.types';
import { CreatePaypalOrderDto } from '../dto/create-paypal-order.dto';
import { UpdatePaymentStepDto } from '../dto/update-payment-step.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('success')
  @HttpCode(200)
  @Public()
  async success(
    @Query('paymentId') paymentId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      // ✅ Capture automatique après approbation
      if (token) {
        await this.paypalService.captureOrder(token);
      }

      return res.send(`
        <h1>Paiement confirmé !</h1>
        <p>Votre paiement a été validé avec succès.</p>
        <a href="http://localhost:3000/payment/${paymentId}">Suivre votre paiement</a>
      `);
    } catch (err) {
      console.error('Échec de la capture:', err);
      return res.status(500).send(`
        <h1>Erreur</h1>
        <p>Le paiement n'a pas pu être finalisé.</p>
        <a href="http://localhost:3000/payment/${paymentId}">Retour</a>
      `);
    }
  }

  @Get('cancel')
  @HttpCode(200)
  @Public()
  async cancel(@Query('paymentId') paymentId: string, @Res() res: Response) {
    return res.send(`
      <h1>Paiement annulé</h1>
      <p>Vous pouvez réessayer quand vous voulez.</p>
      <a href="http://localhost:3000/payment/${paymentId}">Retour</a>
    `);
  }

  @Post('create-order')
  async createOrder(@Body() dto: CreatePaypalOrderDto) {
    const order = await this.paypalService.createOrder(dto.paymentId, dto.amount);
    await this.paymentService.updateStep(dto.paymentId, PaymentProvider.PAYPAL, {
      paypalOrderId: order.id,
      status: PaymentStatus.PENDING,
    });
    const approveUrl = order.links.find((link) => link.rel === 'approve')?.href;
    return { orderId: order.id, approveUrl };
  }

  @Post('capture/:orderId')
  async capture(@Param('orderId') orderId: string) {
    const captureData = await this.paypalService.captureOrder(orderId);
    const paymentId = captureData.purchase_units[0]?.invoice_id;
    if (paymentId) {
      await this.paymentService.updateStep(paymentId, PaymentProvider.PAYPAL, {
        paypalCaptureId: captureData.id,
        status: PaymentStatus.SUCCESS,
      });
    }
    return captureData;
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Public()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: PayPalWebhookHeaders,
  ) {
    const body = req.body as PayPalWebhookEvent;
    console.log('Webhook reçu:', body.event_type, 'ID:', body.id);

    const isVerified = await this.paypalService.verifyWebhook(body, headers);
    if (!isVerified) {
      console.error('Échec de vérification du webhook');
      return res.sendStatus(401);
    }

    const paymentId = body.resource?.invoice_id;
    if (!paymentId) return res.sendStatus(200);

    try {
      const payment = await this.paymentService.findOne(paymentId);
      const step = payment.steps.find((s) => s.paymentProvider === PaymentProvider.PAYPAL);

      if (step?.paypalWebhookEvents?.includes(body.id)) {
        console.log(`Webhook ${body.id} déjà traité`);
        return res.sendStatus(200);
      }

      const updateData: UpdatePaymentStepDto = {
        paypalLastPayload: body,
        paypalWebhookEvents: [...(step?.paypalWebhookEvents || []), body.id],
      };

      switch (body.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          updateData.status = PaymentStatus.SUCCESS;
          updateData.paypalCaptureId = body.resource.id;
          break;

        case 'PAYMENT.CAPTURE.DENIED':
        case 'PAYMENT.CAPTURE.REFUNDED':
        case 'PAYMENT.CAPTURE.REVERSED':
          updateData.status = PaymentStatus.FAILED;
          break;

        case 'CHECKOUT.ORDER.APPROVED': {
          const orderId = body.resource.id;
          if (orderId) {
            await this.paypalService.captureOrder(orderId);
          } else {
            console.error('orderId is undefined in CHECKOUT.ORDER.APPROVED event');
          }
          break;
        }

        default:
          console.log(`Événement non géré: ${body.event_type}`);
          return res.sendStatus(200);
      }

      if (updateData.status) {
        await this.paymentService.updateStep(paymentId, PaymentProvider.PAYPAL, updateData);
      }

      return res.sendStatus(200);
    } catch (err) {
      console.error('Erreur webhook:', err);
      return res.sendStatus(500);
    }
  }
}
