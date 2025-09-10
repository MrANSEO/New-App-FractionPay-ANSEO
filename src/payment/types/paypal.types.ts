export interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface PayPalCreateOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  links: Array<{
    href: string;
    rel: 'self' | 'approve' | 'capture' | 'edit' | 'update';
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  }>;
  purchase_units: Array<{
    invoice_id?: string;
    amount: {
      currency_code: 'USD' | 'EUR';
      value: string;
    };
    payee?: {
      email_address?: string;
      merchant_id?: string;
    };
  }>;
  create_time?: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DENIED' | 'FAILED';
  purchase_units: Array<{
    invoice_id?: string;
    payments?: {
      captures: Array<{
        id: string;
        status: 'COMPLETED' | 'REFUNDED' | 'DECLINED';
        amount: {
          currency_code: string;
          value: string;
        };
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  payer?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address?: string;
  };
  create_time: string;
  update_time: string;
}

export interface PayPalVerifySignatureResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}

export type PayPalWebhookEventType =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'PAYMENT.CAPTURE.COMPLETED'
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'PAYMENT.CAPTURE.DENIED'
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'PAYMENT.CAPTURE.REFUNDED'
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'PAYMENT.CAPTURE.REVERSED'
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'CHECKOUT.ORDER.APPROVED'
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'PAYMENT.CAPTURE.PENDING'
  | string;

export interface PayPalWebhookEvent {
  id: string;
  event_type: PayPalWebhookEventType;
  create_time: string;
  resource: {
    id?: string;
    invoice_id?: string;
    status?: string;
    amount?: {
      currency_code: string;
      value: string;
    };
    seller_protection?: {
      status: string;
      dispute_categories: string[];
    };
  };
  summary: string;
  links?: Array<{
    href: string;
    rel: 'self' | 'payment';
    method: 'GET';
  }>;

  [key: string]: any;
}

export interface PayPalWebhookHeaders {
  'paypal-transmission-id': string;
  'paypal-transmission-time': string;
  'paypal-cert-url': string;
  'paypal-transmission-sig': string;
  'paypal-auth-algo': string;
  [key: string]: string;
}
