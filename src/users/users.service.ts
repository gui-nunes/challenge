import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { baseResponse } from '../core/dto/base.response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  response = {
    message: '',
    data: {},
  };

  async create(data: CreateUserDto): Promise<baseResponse<User>> {
    try {
      const userdb = await this.prisma.user.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          cpf: data.cpf,
          email: data.email,
          password: data.password,
          role: data.role,
          created_at: new Date(),
        },
      });
      return {
        data: userdb,
        message: 'user created with sucess.',
      };
    } catch (error) {
      throw new Error(error);
    }

    // let Role: Role;
    // const result: Prisma.UserCreateInput = data;
    // for (let index = 0; index < 10; index++) {
    //   if (index <= 5) {
    //     Role = 'USER';
    //   } else {
    //     Role = 'VENDOR';
    //   }
    //   await this.prisma.user.create({
    //     data: {
    //       first_name: faker.name.firstName(),
    //       last_name: faker.name.lastName(),
    //       cpf: faker.phone.number(),
    //       email: faker.internet.email(),
    //       password: faker.internet.password(),
    //       role: Role,
    //       created_at: faker.date.past(),
    //     },
    //   });
    //   console.log('creating');
    // }
    // return 'ok';
  }

  async findAll(): Promise<baseResponse<User[]>> {
    try {
      const userdb: Array<User> = await this.prisma.user.findMany();
      return {
        data: userdb,
        message: 'users founded with sucess.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(uid: string): Promise<baseResponse<User>> {
    try {
      const data: User = await this.prisma.user.findUnique({
        where: {
          uid: uid,
        },
      });
      return {
        data: data,
        message: 'user founded with sucess.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(uid: string, data: UpdateUserDto): Promise<baseResponse<User>> {
    try {
      const userdata = await this.prisma.user.update({
        data: { ...data, updated_at: new Date() },
        where: { uid },
      });
      return {
        data: userdata,
        message: 'user updated with sucess.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(uid: string): Promise<baseResponse<User>> {
    try {
      const data = await this.prisma.user.delete({
        where: { uid },
      });
      return {
        data: data,
        message: 'user deleted with sucess.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
