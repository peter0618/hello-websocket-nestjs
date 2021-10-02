import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * User Entity
 */
@Entity()
export class User {
  /**
   * 유일 식별자
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 이름
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * 닉네임
   */
  @Column({ type: 'text' })
  nickName: string;

  /**
   * 로그인 아이디 (unique)
   */
  @Index({ unique: true })
  @Column({ type: 'text' })
  loginId: string;

  /**
   * 로그인 비밀번호
   */
  @Column({ type: 'text' })
  password: string;

  /**
   * 이메일
   */
  @Column({ type: 'text' })
  email: string;

  /**
   * 비고
   */
  @Column({ type: 'text', nullable: true })
  note?: string;

  /**
   * 사용자 권한 그룹
   * TODO : 권한 설계 후 추가해야 합니다.
   */
  // permissionGroupId: number;

  /**
   * 등록일시
   */
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * 수정일시
   */
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
