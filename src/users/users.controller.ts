import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Credentials } from '../auth/decorators/credentials.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserCredential } from 'src/common/enums/user-credential.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    throw new ForbiddenException(
      'You cannot create users from this API, only firebase authentication users could be used',
    );
  }

  @Credentials(UserCredential.USERS_READ)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Credentials(UserCredential.USERS_READ)
  @Get('uid/:uid')
  findOneByUid(@Param('uid') uid: string) {
    return this.usersService.findOneByUid(uid);
  }

  @Credentials(UserCredential.USERS_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Credentials(UserCredential.USERS_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove() {
    throw new MethodNotAllowedException();
  }
}
