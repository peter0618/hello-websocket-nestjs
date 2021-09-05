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

  describe('User Validation', () => {
    it('should validate user', async () => {
      const loginReqDto: LoginReqDto = {
        loginId: 'peter0618',
        password: '1234qwer',
      };
      expect(service.validate(loginReqDto)).toBe(true);
    });
  });
});
