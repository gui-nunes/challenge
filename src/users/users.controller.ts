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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { IBaseResponse } from 'src/core/dto/base.response.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private walletService: WalletService,
  ) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<IBaseResponse<User>> {
    return await this.usersService.create(data);
  }

  @Get()
  async findAll(): Promise<IBaseResponse<User[]>> {
    return await this.usersService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<IBaseResponse<User>> {
    return await this.usersService.findOne(uid);
  }

  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() data: UpdateUserDto,
  ): Promise<IBaseResponse<User>> {
    return await this.usersService.update(uid, data);
  }
  // DEPOSIT-------------------------------------------
  @Patch('/:uid/deposit')
  async deposite(
    @Param('uid') uid: string,
    @Body() data: number,
  ): Promise<IBaseResponse<any>> {
    return await this.walletService.deposite(uid, data);
  }
  // -------------------------------------
  @Delete(':uid')
  async remove(@Param('uid') uid: string): Promise<IBaseResponse<User>> {
    return await this.usersService.remove(uid);
  }
}
