import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import admin from 'firebase-admin';
import { FIREBASE_APP_INJECTION_TOKEN } from 'src/firebase/firebase.module';
import { UsersService } from '../../users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RequestWithUser } from '../interface/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_APP_INJECTION_TOKEN)
    private readonly firebaseApp: admin.app.App,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedIdToken = await this.firebaseApp.auth().verifyIdToken(token);
      const user = await this.usersService.findOneByUid(decodedIdToken.uid);

      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
