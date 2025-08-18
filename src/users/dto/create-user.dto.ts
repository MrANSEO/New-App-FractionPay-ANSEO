import { IsArray, IsString } from 'class-validator';
import { UserCredential } from 'src/common/enums/user-credential.enum';

export class CreateUserDto {
  @IsString()
  uid: string;

  @IsArray()
  credentials: UserCredential[];
}
