import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { Transaction } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';
import { Axios } from 'axios';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}
  dataTransaction: Transaction;

  async create(data: CreateTransactionDto): Promise<any> {
    try {
      const payeeAmount = await this.wallet.paySometing(
        data.uid_wallet_payer,
        data.amount,
      );
      return payeeAmount;
    } catch (error) {
      console.log(error);
      if (error.message == 'insufficient_fund') {
        throw new HttpException('insufficient fund.', HttpStatus.BAD_REQUEST);
      }
      if (error.message == 'no_auth') {
        throw new HttpException('Not_authorized.', HttpStatus.UNAUTHORIZED);
      }
      if (error.message == 'wallet_not_found') {
        throw new HttpException('wallet not founded', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
