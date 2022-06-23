import { Role, User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateUserDto
  implements Omit<User, 'uid' | 'created_at' | 'updated_at'>
{
  @IsString({ message: 'first name must be a {string}' })
  @IsNotEmpty({ message: 'first name not can be empty' })
  first_name: string;

  @IsString({ message: 'last name must be a {string}' })
  @IsNotEmpty({ message: 'last name not can be empty' })
  last_name: string;

  @IsString({ message: 'cpf must be a {string}' })
  @IsNotEmpty({ message: 'last name not can be empty' })
  cpf: string;

  @IsEmail({ message: 'this need be in "example@email.com" format' })
  @IsNotEmpty({ message: 'email not can be empty' })
  email: string;

  @IsString({ message: 'password must be a {string}' })
  @IsNotEmpty({ message: 'password not can be empty' })
  @Length(6, 20, { message: 'password need have between 6 ~ 20 characters' })
  password: string;

  @IsString({ message: 'role must be a {string}' })
  @IsNotEmpty({ message: 'role not can be empty' })
  role: Role;
}
