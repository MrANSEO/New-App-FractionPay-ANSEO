import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { Application } from './schemas/application.schema';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(@Body() createAppDto: CreateAppDto): Promise<Application> {
    return this.applicationService.create(createAppDto);
  }

  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationService.read();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto): Promise<Application> {
    return this.applicationService.update(id, updateAppDto);
  }

  @Patch(':appId/assign/:adminId')
  async assignAppToAdmin(
    @Param('appId') appId: string,
    @Param('adminId') adminId: string,
  ): Promise<Application> {
    return this.applicationService.assignAppToAdmin(appId, adminId);
  }
}
