import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
})
export class AuthModule {}
