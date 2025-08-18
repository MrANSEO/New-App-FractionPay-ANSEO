import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CREDENTIALS_KEY } from '../decorators/credentials.decorator';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { UserCredential } from 'src/common/enums/user-credential.enum';

@Injectable()
export class CredentialsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCredentials = this.reflector.getAllAndOverride<UserCredential[]>(
      CREDENTIALS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredCredentials) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    return requiredCredentials.some((credential) => user?.credentials.includes(credential));
  }
}
