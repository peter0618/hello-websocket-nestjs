import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 사용자 생성 요청 Dto
 */
export class CreateUserReqDto {
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

  /**
   * 비고
   */
  @IsString()
  @IsOptional()
  note?: string;
}
