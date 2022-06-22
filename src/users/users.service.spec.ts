import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { baseResponse } from '../core/dto/base.response.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  function mockReturnUser() {
    const mockUser: User = {
      uid: faker.datatype.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cpf: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'USER',
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    };
    return mockUser;
  }

  function mockBaseResp(data: User, message: string) {
    const resp: baseResponse<User> = {
      data: data,
      message: message,
    };
    return resp;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersService],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockResponse = mockBaseResp(
    mockReturnUser(),
    'user created with sucess.',
  );
  describe('create', () => {
    it('should return a user if this are created with sucess in database', async () => {
      jest.spyOn(prismaMock.user, 'create').mockResolvedValue(mockResponse);
      const result = await service.create(mockResponse.data);
      expect(result).toBe(mockResponse);
    });
  });
});
