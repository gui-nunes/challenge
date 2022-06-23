import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { Transaction } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';
import { Axios } from 'axios';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private users: UsersService,
  ) {}
  dataTransaction: Transaction;

  async create(data: CreateTransactionDto): Promise<any> {
    try {
      const payeeAmount = await this.wallet.paySometing(
        data.uid_wallet_payer,
        data.amount,
      );
      if (payeeAmount !== 'ok') {
        throw new Error(payeeAmount);
      }
      const reciveAmount = await this.wallet.bePayd(
        data.uid_wallet_payee,
        data.amount,
      );
      if (reciveAmount !== 'ok') {
        throw new Error(reciveAmount);
      }

      const saved = await this.prisma.transaction.create({
        data: {
          amount: data.amount,
          uid_wallet_payee: data.uid_wallet_payee,
          uid_wallet_payer: data.uid_wallet_payer,
        },
      });
      console.log(saved);
      if (!saved) {
        throw new Error('error on save in db.');
      }

      const payerWaller = await this.wallet.findOne(data.uid_wallet_payer);
      const payeeWaller = await this.wallet.findOne(data.uid_wallet_payee);

      const payerName = await this.users.findOne(payerWaller.data.uid_owner);
      const payeeName = await this.users.findOne(payeeWaller.data.uid_owner);

      return `${payerName.data.first_name} pagou a ${payeeName.data.first_name} o montante de: $${data.amount} `;
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
