import { Wallet } from '@prisma/client';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWalletDto
  implements Omit<Wallet, 'uid' | 'created_at' | 'updated_at' | 'balance'>
{
  @IsUUID()
  @IsNotEmpty({ message: 'UID is not can be empty.' })
  uid_owner: string;
}
