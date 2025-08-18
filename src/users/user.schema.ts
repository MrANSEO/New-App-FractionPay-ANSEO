import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

import GenericEntity from '../common/schemas/generic.schema';
import { UserCredential } from 'src/common/enums/user-credential.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    versionKey: false,
  },
})
export class User extends GenericEntity {
  @Prop()
  credentials: UserCredential[];

  @Prop({ unique: true, index: true })
  uid: string;
}

export type UserFromFirebase = {
  uid: UserRecord['uid'];
  email: UserRecord['email'];
};

export type FullUserRecord = UserFromFirebase & User;

export const UserSchema = SchemaFactory.createForClass(User);
