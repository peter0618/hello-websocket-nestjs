import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LoginReqDto } from './dto/auth.request.dto';
import { UserService } from '../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    // 로깅할 때 비밀번호가 노출되지 않도록 처리했습니다.
    this.logger.debug(
      `login(loginReqDto.loginId: ${JSON.stringify(loginReqDto.loginId)})`,
    );

    // 아이디, 비밀번호가 유효한지 확인합니다.
    const user = await this.userService.validate(loginReqDto);
    const isUserValid = user !== null;
    const message = isUserValid
      ? '로그인에 성공하였습니다.'
      : '아이디, 비밀번호가 유효하지 않습니다.';

    const responseMessage = {
      success: isUserValid,
      message,
    };

    // 아이디, 비밀번호가 유효하면 jwt 토큰을 생성하여 전달합니다.
    if (isUserValid) {
      const payload = { userName: user.name, userId: user.id };
      responseMessage['token'] = await this.jwtService.signAsync(payload);
    }

    return responseMessage;
  }

  /**
   * jwt token 에 대한 validation 을 수행합니다.
   * (참고 : https://jwt.io/)
   * @param reqDto
   */
  @Post('token-validation')
  async validateJwtToken(@Body() reqDto) {
    let result;
    try {
      result = await this.jwtService.verifyAsync(reqDto.token);
      return result;
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        error: e,
      };
    }
  }
}
