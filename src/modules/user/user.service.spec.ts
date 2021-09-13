import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { LoginReqDto } from '../../auth/dto/auth.request.dto';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Validate User', () => {
    it('should return validated user', async () => {
      const loginReqDto: LoginReqDto = {
        loginId: 'peter0618',
        password: '1234qwer',
      };
      const user = await service.validate(loginReqDto);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('loginId', 'peter0618');
    });

    it('should fail finding user with invalidate loginId', async () => {
      const loginReqDto: LoginReqDto = {
        loginId: 'badId',
        password: '1234qwer',
      };
      expect(await service.validate(loginReqDto)).toBeNull();
    });

    it('should fail finding user with invalidate password', async () => {
      const loginReqDto: LoginReqDto = {
        loginId: 'peter0618',
        password: '0000',
      };
      expect(await service.validate(loginReqDto)).toBeNull();
    });
  });

  describe('Read User', () => {
    it('should get user by validate id', async () => {
      const user = await service.getById(1);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id', 1);
      expect(user).toHaveProperty('name', 'Peter');
      expect(user).toHaveProperty('loginId', 'peter0618');
    });
  });
});
