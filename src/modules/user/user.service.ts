import { Injectable, Logger } from '@nestjs/common';
import { User } from './entity/user.entity';
import { LoginReqDto } from '../../auth/dto/auth.request.dto';
import { validateHash } from '../../common/utils/crypto.util';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  users: User[];

  constructor() {
    this.initUsers();
  }

  /**
   * initialize test users
   * @private
   */
  private initUsers() {
    this.users = [
      {
        id: 1,
        name: 'Peter',
        loginId: 'peter0618',
        password:
          '$2b$10$F4M6hHaSZsKRTAtJUt.pAuHfac4R5VVb6.QTM/rgWk2TjDcCH5w6C', // 1234qwer
      },
      {
        id: 2,
        name: 'Grace',
        loginId: 'grace8701',
        password:
          '$2b$10$wEUG0pu1QdqMErquCXx3XOVWyHDRYuk0wZBvmcRivFr9d/WiOTdPO', // 12345678
      },
      {
        id: 3,
        name: 'Eunsung',
        loginId: 'eunsung0623',
        password:
          '$2b$10$i3EeI/eIu7eONqcZvIA4xeJi2oSoE0valxWlILlD.44E9GyYA7a52', // 0987qwer
      },
    ];
  }

  /**
   * 로그인 요청 정보(사용자 아이디, 비밀번호)가 유효한지 검증합니다.
   * TODO : 각각의 상황에 따른 Exception 처리
   * @param loginReqDto
   */
  async validate(loginReqDto: LoginReqDto): Promise<User> {
    const { loginId, password } = loginReqDto;
    const filteredUsers = this.users.filter((user) => user.loginId === loginId);
    if (filteredUsers.length === 0) {
      this.logger.debug(`id 가 ${loginId}인 사용자가 존재하지 않습니다.`);
      return null;
    }

    // 사용자 아이디는 유효한 상태에서 비밀번호 유효성 검증
    const isPasswordValid = await validateHash(
      password,
      filteredUsers[0].password,
    );
    return isPasswordValid ? filteredUsers[0] : null;
  }
}
