// src/application/application.service.ts
import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { Application } from './schemas/application.schema';

@Injectable()
export class ApplicationService {
  constructor(private readonly repository: ApplicationRepository) {}

  create(dto: CreateAppDto): Promise<Application> {
    return this.repository.create(dto);
  }

  read(): Promise<Application[]> {
    return this.repository.findAll();
  }

  update(id: string, dto: UpdateAppDto): Promise<Application> {
    return this.repository.update(id, dto);
  }

  assignAppToAdmin(appId: string, adminId: string): Promise<Application> {
    return this.repository.assignAppToAdmin(appId, adminId);
  }
}
