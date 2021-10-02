import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserReqDto } from './dto/user.request.dto';
import { UserRepository } from './user.repository';
import { UserMapper } from './mapper/user.mapper';
import { CreateUserResDto } from './dto/user.response.dto';
import { generateHash } from '../../common/utils/crypto.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly userMapper: UserMapper) {}

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
}
