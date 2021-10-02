import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 로그인 요청 Dto
 */
export class LoginReqDto {
  /**
   * 로그인 아이디
   */
  @IsString()
  @IsNotEmpty()
  loginId: string;

  /**
   * 로그인 비밀번호
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
