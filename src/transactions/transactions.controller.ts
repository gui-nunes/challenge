import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@prisma/client';
import { IBaseResponse } from '../core/dto/base.response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() data: CreateTransactionDto,
  ): Promise<IBaseResponse<Transaction>> {
    return await this.transactionsService.create(data);
  }

  @Get()
  async findAll(): Promise<IBaseResponse<Transaction[]>> {
    return await this.transactionsService.findAll();
  }

  @Get(':uid')
  async findOne(
    @Param('uid') uid: string,
  ): Promise<IBaseResponse<Transaction>> {
    return await this.transactionsService.findOne(uid);
  }

  @Delete(':uid')
  async remove(@Param('uid') uid: string): Promise<IBaseResponse<Transaction>> {
    return await this.transactionsService.remove(uid);
  }
}
