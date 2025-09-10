import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDocument } from '../schemas/payment.schema';
import {
  PayPalTokenResponse,
  PayPalCreateOrderResponse,
  PayPalCaptureResponse,
  PayPalVerifySignatureResponse,
} from '../types/paypal.types';

@Injectable()
export class PaypalService {
  private readonly baseUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  private readonly webhookId = process.env.PAYPAL_WEBHOOK_ID;

  constructor(@InjectModel('Payment') private paymentModel: Model<PaymentDocument>) {}

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new HttpException('Missing PayPal credentials', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const { data } = await axios.post<PayPalTokenResponse>(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data.access_token;
  }

  async createOrder(paymentId: string, amount: number): Promise<PayPalCreateOrderResponse> {
    const accessToken = await this.getAccessToken();

    const returnURL = process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/paypal/success';
    const cancelURL = process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/paypal/cancel';

    const { data } = await axios.post<PayPalCreateOrderResponse>(
      `${this.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            invoice_id: paymentId,
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${returnURL}?paymentId=${paymentId}`,
          cancel_url: `${cancelURL}?paymentId=${paymentId}`,
          user_action: 'PAY_NOW',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  }

  async captureOrder(orderId: string): Promise<PayPalCaptureResponse> {
    const accessToken = await this.getAccessToken();

    const { data } = await axios.post<PayPalCaptureResponse>(
      `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  }

  async verifyWebhook(body: unknown, headers: Record<string, string>): Promise<boolean> {
    const transmissionId = headers['paypal-transmission-id']?.trim();
    const transmissionTime = headers['paypal-transmission-time']?.trim();
    const certUrl = headers['paypal-cert-url']?.trim();
    const actualSignature = headers['paypal-transmission-sig']?.trim();
    const authAlgo = headers['paypal-auth-algo']?.trim();

    if (!transmissionId || !transmissionTime || !certUrl || !actualSignature || !authAlgo) {
      console.error('Webhook error: Missing required headers');
      return false;
    }

    try {
      const accessToken = await this.getAccessToken();

      const { data } = await axios.post<PayPalVerifySignatureResponse>(
        `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
        {
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: actualSignature,
          transmission_time: transmissionTime,
          webhook_id: this.webhookId,
          webhook_event: body,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Réponse de PayPal:', data);
      return data.verification_status === 'SUCCESS';
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Erreur complète:', error.response?.data || error.message);
      return false;
    }
  }
}
