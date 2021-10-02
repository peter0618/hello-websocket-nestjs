import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserReqDto } from './dto/user.request.dto';
import { CreateUserResDto } from './dto/user.response.dto';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자를 생성합니다.
   * @param dto
   */
  @Post()
  create(@Body() dto: CreateUserReqDto): Promise<CreateUserResDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = dto; // 비밀번호 로깅을 제외시킵니다.
    this.logger.debug(`create(dto: ${JSON.stringify(rest)})`);
    return this.userService.create(dto);
  }
}
