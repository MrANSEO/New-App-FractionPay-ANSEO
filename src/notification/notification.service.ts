import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: `"Fraction Pay" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        text,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erreur envoi email :', error);
      throw new InternalServerErrorException('Impossible d’envoyer l’email');
    }
  }

  async sendPaymentPending(to: string, amount: number) {
    return this.sendMail(
      to,
      'Votre paiement est en attente',
      `Votre paiement de ${amount} FCFA est en attente.`,
    );
  }

  async sendPaymentSuccess(to: string, amount: number) {
    return this.sendMail(to, 'Paiement réussi', `Votre paiement de ${amount} FCFA a été validé.`);
  }

  async sendPaymentFailed(to: string, amount: number) {
    return this.sendMail(to, 'Échec du paiement', `Votre paiement de ${amount} FCFA a échoué.`);
  }
}
