import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { IBaseResponse } from '../core/dto/base.response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mocks
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
            remove: jest.fn(),
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

  const baseMock: IBaseResponse<User> = {
    data: mockReturnUser(),
    message: 'ok',
  };

  describe('Create', () => {
    it('should return a user if this are created with sucess in database', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(baseMock);
      const result = await controller.create(baseMock.data);
      expect(result).toBe(baseMock);
    });

    it('should throw a error if something is wrong', async () => {
      jest.spyOn(service, 'create').mockRejectedValue('error');
      expect(controller.create(baseMock.data)).rejects.toThrowError('error');
    });
  });

  // describe('findAll', () => {
  //   it('should return a list of users', async () => {
  //     const baseMockArray: IBaseResponse<User[]> = {
  //       data: [mockReturnUser(), mockReturnUser()],
  //       message: 'ok',
  //     };
  //     jest.spyOn(service, 'findAll').mockResolvedValue(IBaseResponse);
  //     const response = await controller.findAll();
  //     expect(response).toBe(baseMockArray);
  //   });

  //   it('should throw a error if something is wrong', () => {
  //     jest.spyOn(service, 'findAll').mockRejectedValue('error');
  //     expect(controller.findAll()).rejects.toThrowError('error');
  //   });
  // });

  describe('findOne', () => {
    const mockUser = mockReturnUser();
    it('should return a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(baseMock);
      const response = await controller.findOne(baseMock.data.uid);
      expect(response).toBe(baseMock);
    });

    it('should throw a error if something is wrong', () => {
      jest.spyOn(service, 'findOne').mockRejectedValue('error');
      expect(controller.findOne(mockUser.uid)).rejects.toThrowError('error');
    });
  });

  describe('update', () => {
    const mockUserUpdated = mockReturnUser();
    it('should return a user with updated_at property', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(baseMock);
      const response = await controller.update(
        mockUserUpdated.uid,
        mockUserUpdated,
      );
      expect(response.data.updated_at).toBeDefined();
      expect(response).toBe(baseMock);
    });

    it('should throw a error if something is wrong', () => {
      jest.spyOn(service, 'update').mockRejectedValue('error');
      expect(
        controller.update(mockUserUpdated.uid, mockUserUpdated),
      ).rejects.toThrowError('error');
    });
  });

  describe('remove', () => {
    it('should return a user deleted and a message confirming it', () => {
      jest.spyOn(service, 'remove').mockResolvedValue(baseMock);
    });

    it('should throw a error if something is wrong', () => {
      jest.spyOn(service, 'remove').mockRejectedValue('error');
      expect(controller.remove('any_uid')).rejects.toThrowError('error');
    });
  });
});
