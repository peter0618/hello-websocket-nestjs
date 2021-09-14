import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

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
