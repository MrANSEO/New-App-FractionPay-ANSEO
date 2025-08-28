import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application, AppSchema } from './schemas/application.schema';
import { ApplicationRepository } from './application.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Application.name, schema: AppSchema }])],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
