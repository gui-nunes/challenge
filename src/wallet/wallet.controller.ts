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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from '@prisma/client';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { JwtAuthGuard } from '../core/auth/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<IBaseResponse<Wallet>> {
    return await this.walletService.create(createWalletDto);
  }

  @Get()
  async findAll(): Promise<IBaseResponse<Wallet[]>> {
    return await this.walletService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<IBaseResponse<Wallet>> {
    return await this.walletService.findOne(uid);
  }

  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<IBaseResponse<Wallet>> {
    return await this.walletService.update(uid, updateWalletDto);
  }

  @Delete(':uid')
  async remove(@Param('uid') uid: string): Promise<IBaseResponse<Wallet>> {
    return await this.walletService.remove(uid);
  }
}
