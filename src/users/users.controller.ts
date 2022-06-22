import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: User) {
    return await this.usersService.create(data);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return await this.usersService.findOne(uid);
  }

  @Patch(':uid')
  async update(@Param('uid') uid: string, @Body() data: User) {
    return await this.usersService.update(uid, data);
  }

  @Delete(':uid')
  async remove(@Param('uid') uid: string) {
    return await this.usersService.remove(uid);
  }
}
