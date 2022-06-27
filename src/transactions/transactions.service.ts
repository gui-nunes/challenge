import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { Transaction } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}
  dataTransaction: Transaction;

  async create(
    data: CreateTransactionDto,
  ): Promise<IBaseResponse<Transaction>> {
    try {
      if (data.amount == 0) {
        throw new Error('amount_zero');
      }
      const transaction = await this.wallet.transfer(
        data.uid_wallet_payer,
        data.uid_wallet_payee,
        data.amount,
      );
      if (transaction !== 'transaction_realized') {
        throw new Error('transaction_fail.');
      }
      const transactionData = await this.prisma.transaction.create({
        data: {
          uid_wallet_payee: data.uid_wallet_payee,
          uid_wallet_payer: data.uid_wallet_payer,
          amount: data.amount,
        },
      });

      if (!transactionData) {
        throw new Error();
      }

      return { data: transactionData, message: 'transaction done' };
    } catch (error) {
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

  async findAll(): Promise<IBaseResponse<Transaction[]>> {
    try {
      const transactionData: Transaction[] =
        await this.prisma.transaction.findMany();
      if (transactionData.length == 0) {
        throw new Error('no_transaction_found');
      }
      return { data: transactionData, message: 'transactions found.' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(uid: string): Promise<IBaseResponse<Transaction>> {
    try {
      const transactionData = await this.prisma.transaction.findUnique({
        where: {
          uid,
        },
      });
      if (!transactionData) {
        throw new Error('not_found');
      }
      return { data: transactionData, message: 'transaction found.' };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('Transaction Not Found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(uid: string): Promise<IBaseResponse<any>> {
    try {
      const transactionData = this.prisma.transaction.delete({
        where: { uid },
      });
      return { data: transactionData, message: 'transactions found.' };
    } catch (error) {}
  }
}
