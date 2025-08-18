import { SetMetadata } from '@nestjs/common';
import { UserCredential } from 'src/common/enums/user-credential.enum';

export const CREDENTIALS_KEY = 'Credentials';
export const Credentials = (...creds: UserCredential[]) => SetMetadata(CREDENTIALS_KEY, creds);
