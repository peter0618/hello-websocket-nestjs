import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserReqDto } from './dto/user.request.dto';
import { UserRepository } from './user.repository';
import { UserMapper } from './mapper/user.mapper';
import { CreateUserResDto } from './dto/user.response.dto';
import { generateHash } from '../../common/utils/crypto.util';
import { User } from './entity/user.entity';
import { generate_sign_up_alarm_message } from '../../slack-notification/message-templates/slack.message.template';
import { ConfigService } from '@nestjs/config';
import { SlackNotificationService } from '../../slack-notification/slack-notification.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService,
    private readonly slackNotificationService: SlackNotificationService,
  ) {}

  /**
   * 사용자 Entity 를 생성하여 리턴합니다.
   * @param dto
   */
  async create(dto: CreateUserReqDto): Promise<CreateUserResDto> {
    // 1) 로그인 아이디 중복검사
    if (await this.isLoginIdDuplicate(dto.loginId)) {
      throw new HttpException(`이미 사용중인 로그인 아이디 입니다. (${dto.loginId})`, HttpStatus.NOT_ACCEPTABLE);
    }

    // 2) 비밀번호 암호화
    const password = await generateHash(dto.password);

    // 3) 사용자 생성
    const userEntity = await this.userRepository.save(Object.assign(dto, { password }));

    // 4) 사용자 생성 슬랙 알림
    // fixme event emitter 로 빼는 것이 구조적으로 더 좋을 것 같습니다.
    const appEnv = this.configService.get<string>('APP_ENV');
    if (appEnv === 'prod') {
      const title = '신규 회원가입 알림';
      const message = generate_sign_up_alarm_message(userEntity);
      const icon = ':helmet_with_white_cross';
      this.slackNotificationService.sendMessage(title, message, null, icon);
    }
    return this.userMapper.toCreateUserResponseDto(userEntity);
  }

  /**
   * 로그인 아이디 중복을 확인합니다.
   * @param loginId
   */
  async isLoginIdDuplicate(loginId: string): Promise<boolean> {
    const count = await this.userRepository.count({ loginId });
    return count > 0;
  }

  /**
   * 사용자를 유일식별자로 조회합니다.
   * @param userId
   */
  getById(userId: number): Promise<User> {
    return this.userRepository.findOne({ id: userId });
  }

  /**
   * 사용자를 로그인 아이디로 조회합니다.
   * @param loginId
   */
  getByLoginId(loginId: string): Promise<User> {
    return this.userRepository.findOne({ loginId });
  }
}
