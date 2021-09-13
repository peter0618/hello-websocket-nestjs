import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthModule } from '../../auth/auth.module';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { User } from './entity/user.entity';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigurationModule],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll() function should return user list', () => {
    const dummyUser: User = {
      id: 1,
      name: 'userName',
      loginId: 'loginId',
      password: 'password',
    };
    const result = controller.getAll(dummyUser);
    expect(Array.isArray(result)).toBe(true);
  });
});
