import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from './activities/activities.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { CredentialsGuard } from './auth/guards/credentials.guard';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI!),
    ActivitiesModule,
    UsersModule,
    AuthModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: CredentialsGuard },
  ],
})
export class AppModule {}
