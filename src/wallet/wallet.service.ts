import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import axios from 'axios';
import { IBaseResponse } from 'src/core/dto/base.response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateWalletDto): Promise<IBaseResponse<Wallet>> {
    try {
      const walletData: Wallet = await this.prisma.wallet.create({
        data: {
          uid_owner: data.uid_owner,
          balance: data.balance,
        },
      });

      return { data: walletData, message: 'Wallet created.' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<IBaseResponse<Wallet[]>> {
    try {
      const walletData: Wallet[] = await this.prisma.wallet.findMany();
      return { data: walletData, message: 'All wallets founded.' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(uid: string): Promise<IBaseResponse<Wallet>> {
    try {
      const walletData: Wallet = await this.prisma.wallet.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!walletData) {
        throw new Error('not_found');
      }
      return { data: walletData, message: 'Wallet founded.' };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deposite(uid: string, data: any): Promise<IBaseResponse<any>> {
    try {
      if (data.value < 0) {
        throw new Error('negative_value');
      }
      const walletExists: Wallet = await this.prisma.wallet.findUnique({
        where: {
          uid_owner: uid,
        },
      });
      if (!walletExists) {
        throw new Error('not_found');
      }
      walletExists.balance += data.value;
      const walletData: Wallet = await this.prisma.wallet.update({
        where: { uid_owner: uid },
        data: {
          balance: walletExists.balance,
          updated_at: new Date(),
        },
      });

      return { data: walletData, message: 'Wallet updated.' };
    } catch (error) {
      if (error.message == 'negative_value') {
        throw new HttpException('Invalid value.', HttpStatus.BAD_REQUEST);
      }
      if (error.message == 'not_found') {
        throw new HttpException('Wallet not found.', HttpStatus.NOT_FOUND);
      }
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async bePayd(uid: string, value: any): Promise<string> {
    try {
      const walletFound = await this.prisma.wallet.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!walletFound) {
        throw new Error('wallet_not_found');
      }

      await this.prisma.wallet.update({
        where: { uid },
        data: {
          balance: walletFound.balance + value.balance,
        },
      });
      return 'Transaction realized.';
    } catch (error) {
      if (error.message == 'wallet_not_found') {
        throw new HttpException('wallet not founded', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async paySometing(uid: string, amount: number): Promise<string> {
    try {
      const walletFound = await this.prisma.wallet.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!walletFound) {
        throw new Error('wallet_not_found');
      }
      if (walletFound.balance < amount) {
        throw new Error('insufficient_fund');
      }
      const data = walletFound.balance - amount;
      const auth = await axios.post(
        'https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6',
        [data],
      );
      if (auth.data.message !== 'Autorizado') {
        throw new Error('no_auth');
      }
      await this.prisma.wallet.update({
        where: { uid },
        data: {
          balance: walletFound.balance - amount,
        },
      });
      return 'Transaction realized.';
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

  async update(
    uid: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<IBaseResponse<Wallet>> {
    try {
      const walletExists: Wallet = await this.prisma.wallet.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!walletExists) {
        throw new Error('not_found');
      }
      const walletData: Wallet = await this.prisma.wallet.update({
        where: { uid },
        data: { ...updateWalletDto, updated_at: new Date() },
      });

      return { data: walletData, message: 'Wallet updated.' };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('Wallet not found.', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(uid: string): Promise<IBaseResponse<Wallet>> {
    try {
      const walletExists: Wallet = await this.prisma.wallet.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!walletExists) {
        throw new Error('not_found');
      }
      const walletData: Wallet = await this.prisma.wallet.delete({
        where: { uid },
      });
      return { data: walletData, message: 'Wallet deleted.' };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('Wallet not found.', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
