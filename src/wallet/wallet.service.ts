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

  async transfer(uid_payer: string, uid_payee: string, amount: number) {
    try {
      // ENCONTRA AS CARTEIRAS
      const walletPayerFound = await this.prisma.wallet.findUnique({
        where: {
          uid: uid_payer,
        },
      });
      if (!walletPayerFound) {
        throw new Error('wallet_payer_not_found');
      }
      const typeOfUser = await this.prisma.user.findUnique({
        where: { uid: walletPayerFound.uid_owner },
      });
      // VERIFICA SE O DONO NAO É VENDEDOR
      if (typeOfUser.role == 'VENDOR') {
        throw new Error('vendors_cannot_pay');
      }
      const walletPayeeFound = await this.prisma.wallet.findUnique({
        where: {
          uid: uid_payee,
        },
      });
      if (!walletPayeeFound) {
        throw new Error('wallet_payee_not_found');
      }
      // VERIFICA SE A CARTEIRA TEM O VALOR DISPONIVEL
      if (walletPayerFound.balance < amount) {
        throw new Error('insufficient_funds');
      }
      // CONSULTA SERVIÇO AUTORIZADOR EXTERNO
      const auth = await axios.post(
        'https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6',
        `transaction: payer:${walletPayerFound.uid}, payee:${
          walletPayeeFound.uid
        }, value: ${amount}, type: ${'transfer'}`,
      );
      if (auth.data.message !== 'Autorizado') {
        throw new Error('not_auth');
      }
      // REALIZA A TRANSAFERENCIA
      let realized: string;
      try {
        await this.prisma.wallet.update({
          where: {
            uid: walletPayerFound.uid,
          },
          data: {
            balance: walletPayerFound.balance - amount,
          },
        });
        await this.prisma.wallet.update({
          where: {
            uid: walletPayeeFound.uid,
          },
          data: {
            balance: walletPayeeFound.balance + amount,
          },
        });
        realized = 'ok';
      } catch (error) {
        throw new Error(error);
      }
      if (realized !== 'ok') {
        throw new Error('transaction_fail.');
      }
      return 'transaction_realized';
    } catch (error) {
      throw new Error(error);
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
