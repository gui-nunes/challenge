import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBaseResponse } from '../core/dto/base.response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  returnBaseResponse: IBaseResponse<User>;

  async create(data: CreateUserDto): Promise<IBaseResponse<User>> {
    try {
      const userdata = await this.prisma.user.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          cpf: data.cpf,
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
          role: data.role,
          created_at: new Date(),
        },
      });
      return (this.returnBaseResponse = {
        data: userdata,
        message: 'user created with sucess.',
      });
    } catch (error) {
      if (
        String(error.message).includes(
          ' Unique constraint failed on the fields: (`email`)',
        )
      ) {
        throw new HttpException('Email already exists', 400);
      }
      if (
        String(error.message).includes(
          ' Unique constraint failed on the fields: (`cpf`)',
        )
      ) {
        throw new HttpException('CPF already exists', 400);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<IBaseResponse<string[]>> {
    try {
      const userdata = await this.prisma.user.findMany();
      if (userdata.length == 0) {
        throw new Error('not_found');
      }
      const first_name: string[] = userdata.map((user) => user.first_name);
      return {
        data: first_name,
        message: 'users founded with sucess.',
      };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('no users found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(first_name: string): Promise<User> {
    try {
      const userdata = await this.prisma.user.findFirst({
        where: {
          first_name: first_name,
        },
      });
      if (!userdata) {
        throw new Error('not_found');
      }
      return userdata;
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('no user found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(uid: string): Promise<IBaseResponse<User>> {
    try {
      const userdata = await this.prisma.user.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!userdata) {
        throw new Error('not_found');
      }
      return {
        data: userdata,
        message: 'user founded with sucess.',
      };
    } catch (error) {
      if (error.message == 'not_found') {
        throw new HttpException('no user found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(uid: string, data: UpdateUserDto): Promise<IBaseResponse<User>> {
    try {
      const userfound = await this.prisma.user.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!userfound) {
        throw new Error('user_not_found');
      }

      const userdata = await this.prisma.user.update({
        where: { uid },
        data: { ...data, updated_at: new Date() },
      });
      return {
        data: userdata,
        message: 'user updated with sucess.',
      };
    } catch (error) {
      if (error.message == 'user_not_found') {
        throw new HttpException('user not founded', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(uid: string): Promise<IBaseResponse<User>> {
    try {
      const userfound = await this.prisma.user.findUnique({
        where: {
          uid: uid,
        },
      });
      if (!userfound) {
        throw new Error('user_not_found');
      }

      const userdata = await this.prisma.user.delete({
        where: { uid },
      });
      return {
        data: userdata,
        message: 'user deleted with sucess.',
      };
    } catch (error) {
      if (error.message == 'user_not_found') {
        throw new HttpException('user not founded', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
