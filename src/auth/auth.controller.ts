import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LoginReqDto } from './dto/auth.request.dto';
import { UserService } from '../modules/user/user.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    // 로깅할 때 비밀번호가 노출되지 않도록 처리했습니다.
    this.logger.debug(
      `login(loginReqDto.loginId: ${JSON.stringify(loginReqDto.loginId)})`,
    );

    // 아이디, 비밀번호가 유효한지 확인
    const isUserValid = await this.userService.validate(loginReqDto);
    const message = isUserValid
      ? '로그인에 성공하였습니다.'
      : '아이디, 비밀번호가 유효하지 않습니다.';

    const responseMessage = {
      success: isUserValid,
      message,
    };

    // TODO : 아이디, 비밀번호가 유효하면 jwt 토큰 생성하여 전달
    if (isUserValid) {
      responseMessage['token'] = 'have to make valid token';
    }

    return responseMessage;
  }
}
