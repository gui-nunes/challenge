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
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.create(data);
    } catch (error) {
      throw new Error('error');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new Error('error');
    }
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    try {
      return await this.usersService.findOne(uid);
    } catch (error) {
      throw new Error('error');
    }
  }

  @Patch(':uid')
  async update(@Param('uid') uid: string, @Body() data: User) {
    try {
      return await this.usersService.update(uid, data);
    } catch (error) {
      throw new Error('error');
    }
  }

  @Delete(':uid')
  async remove(@Param('uid') uid: string) {
    try {
      return await this.usersService.remove(uid);
    } catch (error) {
      throw new Error('error');
    }
  }
}
