import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';
import { User } from '../modules/user/entity/user.entity';
import { validateHash } from '../common/utils/crypto.util';
import { SignupReqDto } from './dto/auth.request.dto';
import { CreateUserResDto } from '../modules/user/dto/user.response.dto';

/**
 * 인증 관련 비즈니스 로직을 처리하는 서비스입니다.
 * 1) 사용자 로그인 아이디, 비밀번호 인증
 * 2) jwt token 생성
 * 3) jwt token validation
 */
@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly jwtService: JwtService, private readonly userServer: UserService) {}

  /**
   * 전달받은 로그인 아이디, 비밀번호가 유효한 정보인지 확인합니다.
   * 유효한 정보이면 해당 user 정보를, 유효하지 않은 경우 null 을 리턴합니다.
   * @param loginId
   * @param password
   */
  async validateUser(loginId: string, password: string) {
    const user = await this.userServer.getByLoginId(loginId);
    if (user && (await validateHash(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * user 정보로 부터 payload 를 추출하여 jwt token 을 생성합니다.
   * @param user
   */
  async generateJwtToken(user: User): Promise<string> {
    const payload = { userName: user.name, userId: user.id };
    return this.jwtService.signAsync(payload);
  }

  /**
   * jwt 토큰 validation 을 수행합니다.
   * validation 이 성공하면 payload (claim 목록) 를 리턴합니다.
   * @param token
   */
  async validateJwtToken(token) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
      return {
        success: true,
        payload,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        error: e,
      };
    }
  }

  /**
   * 회원 가입 처리
   * @param dto
   */
  signup(dto: SignupReqDto): Promise<CreateUserResDto> {
    return this.userServer.create(dto);
  }
}
