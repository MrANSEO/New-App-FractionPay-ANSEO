import { Prop } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

export class Payer {
  @Prop({ required: true })
  @IsEmail()
  email: string;
}
