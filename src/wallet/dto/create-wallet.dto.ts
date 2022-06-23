import { Wallet } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateWalletDto
  implements Omit<Wallet, 'uid' | 'created_at' | 'updated_at'>
{
  @IsUUID()
  @IsNotEmpty({ message: 'UID is not can be empty.' })
  uid_owner: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Need some value.' })
  balance: number;
}
