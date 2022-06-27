import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, WalletService],
  exports: [UsersService],
})
export class UsersModule {}
