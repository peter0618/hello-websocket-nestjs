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

/**
 * 회원가입 요청 Dto
 */
export class SignupReqDto {
  /**
   * 이름
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 닉네임
   */
  @IsString()
  @IsNotEmpty()
  nickName: string;

  /**
   * 로그인 아이디 (unique)
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

  /**
   * 이메일
   */
  @IsString()
  @IsNotEmpty()
  email: string;
}
