import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginReqDto } from './dto/auth.request.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    const { loginId, password } = loginReqDto;
    this.logger.debug(`login(loginId: ${JSON.stringify(loginId)})`);

    // 아이디, 비밀번호가 유효한지 확인합니다.
    const user = await this.authService.validateUser(loginId, password);
    if (!user) {
      // 이름은 Unauthorized 이지만, Unauthenticated 의 의미임 (status code : 401)
      // (https://ko.wikipedia.org/wiki/HTTP_%EC%83%81%ED%83%9C_%EC%BD%94%EB%93%9C)
      throw new UnauthorizedException();
    }

    // 아이디, 비밀번호가 유효하면 jwt 토큰을 생성하여 전달합니다.
    const payload = { userName: user.name, userId: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const message = '로그인에 성공하였습니다.';
    return {
      success: true,
      message,
      token: accessToken,
    };
  }

  /**
   * jwt token 에 대한 validation 을 수행합니다.
   * (참고 : https://jwt.io/)
   * @param reqDto
   */
  @Post('token-validation')
  async validateJwtToken(@Body() reqDto) {
    return await this.authService.validateJwtToken(reqDto.token);
  }
}
