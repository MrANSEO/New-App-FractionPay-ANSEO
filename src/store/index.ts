export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentProvider = 'PAYPAL' | 'MOMO' | 'ORANGE_MONEY';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export interface PaymentStep {
  amount: number;
  paymentProvider: PaymentProvider;
  status: PaymentStatus;
  paypalOrderId?: string;
  paypalCaptureId?: string;
}

export interface Payment {
  paymentId: string;
  payer: { email: string };
  steps: PaymentStep[];
  status: PaymentStatus;
  totalAmount: number;
  createdAt: string;
}

export interface App {
  id: string;
  name: string;
  apiKey: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;