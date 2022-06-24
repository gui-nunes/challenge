import { Transaction } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto
  implements Omit<Transaction, 'uid' | 'created_at'>
{
  @IsUUID('4')
  @IsNotEmpty({ message: 'UUID of payer not can be empty' })
  uid_wallet_payer: string;

  @IsUUID('4')
  @IsNotEmpty({ message: 'UUID of payee not can be empty' })
  uid_wallet_payee: string;

  @IsNumber()
  @IsNotEmpty({ message: 'the amount of transactions not can be empty' })
  amount: number;
}
