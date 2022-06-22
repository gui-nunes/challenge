import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
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

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(uid: string) {
    return await this.prisma.user.findUnique({
      where: {
        uid: uid,
      },
    });
  }

  async update(uid: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      data: { ...data, updated_at: new Date() },
      where: { uid },
    });
  }

  async remove(uid: string) {
    return await this.prisma.user.delete({
      where: { uid },
    });
  }
}
