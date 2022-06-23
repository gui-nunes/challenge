import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { Transaction } from '@prisma/client';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  dataTransaction: Transaction;
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<IBaseResponse<Transaction>> {
    return { data: this.dataTransaction, message: 'ok' };
  }

  async findAll(): Promise<IBaseResponse<Transaction>> {
    return { data: this.dataTransaction, message: 'ok' };
  }

  async findOne(uid: string): Promise<IBaseResponse<Transaction>> {
    return { data: this.dataTransaction, message: 'ok' };
  }

  async update(
    uid: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<IBaseResponse<Transaction>> {
    return { data: this.dataTransaction, message: 'ok' };
  }

  async remove(uid: string): Promise<IBaseResponse<Transaction>> {
    return { data: this.dataTransaction, message: 'ok' };
  }
}
