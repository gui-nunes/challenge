import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { JwtAuthGuard } from '../core/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() data: CreateUserDto): Promise<IBaseResponse<User>> {
    return await this.usersService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<IBaseResponse<string[]>> {
    return await this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<IBaseResponse<User>> {
    return await this.usersService.findOne(uid);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() data: UpdateUserDto,
  ): Promise<IBaseResponse<User>> {
    return await this.usersService.update(uid, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uid')
  async remove(@Param('uid') uid: string): Promise<IBaseResponse<User>> {
    return await this.usersService.remove(uid);
  }
}
