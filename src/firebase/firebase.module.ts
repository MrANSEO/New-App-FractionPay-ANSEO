import { FactoryProvider, Module } from '@nestjs/common';
import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

export const FIREBASE_APP_INJECTION_TOKEN = 'FIREBASE_APP';

const firebaseProvider: FactoryProvider<admin.app.App> = {
  provide: FIREBASE_APP_INJECTION_TOKEN,
  useFactory: () => {
    return admin.initializeApp({
      credential: applicationDefault(),
    });
  },
};

@Module({
  providers: [firebaseProvider],
  exports: [FIREBASE_APP_INJECTION_TOKEN],
})
export class FirebaseModule {}
