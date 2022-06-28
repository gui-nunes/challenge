import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [UsersModule, TransactionsModule, WalletModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
