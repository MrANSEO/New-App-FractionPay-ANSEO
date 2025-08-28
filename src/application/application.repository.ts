import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectModel(Application.name)
    private readonly model: Model<ApplicationDocument>,
  ) {}

  async create(dto: CreateAppDto): Promise<Application> {
    const created = new this.model(dto);
    return created.save();
  }

  async findAll(): Promise<Application[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Application> {
    const app = await this.model.findById(id).exec();
    if (!app) throw new NotFoundException(`App ${id} not found`);
    return app;
  }

  async update(id: string, dto: UpdateAppDto): Promise<Application> {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`App ${id} not found`);
    return updated;
  }

  async assignAppToAdmin(appId: string, adminId: string): Promise<Application> {
    const app = await this.model.findById(appId);
    if (!app) throw new NotFoundException(`App ${appId} not found`);

    app.responsibleAdmin = new Types.ObjectId(adminId);
    return app.save();
  }
}
