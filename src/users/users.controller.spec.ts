import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mocks
  const mockUserArray: User[] = [
    {
      uid: faker.datatype.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cpf: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'USER',
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      uid: faker.datatype.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cpf: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'VENDOR',
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create', () => {
    it('should return a user if this are created with sucess in database', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockUserArray[0]);
      const result = await controller.create(mockUserArray[0]);
      expect(result).toBe(mockUserArray[0]);
      console.log(result);
    });
    // it('should throw a error')
  });
});
