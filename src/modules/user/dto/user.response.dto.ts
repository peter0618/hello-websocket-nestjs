/**
 * 사용자 생성 응답 Dto
 */
export class CreateUserResDto {
  /**
   * 유일 식별자
   */
  id: number;

  /**
   * 이름
   */
  name: string;

  /**
   * 닉네임
   */
  nickName: string;

  /**
   * 로그인 아이디 (unique)
   */
  loginId: string;

  /**
   * 이메일
   */
  email: string;

  /**
   * 비고
   */
  note?: string;

  /**
   * 등록일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
}
