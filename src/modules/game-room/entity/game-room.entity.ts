import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

/**
 * Game Room Entity
 */
@Entity()
export class GameRoom {
  /**
   * 유일 식별자
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 방 제목
   */
  @Column({ type: 'text' })
  title: string;

  /**
   * 방장
   */
  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;

  /**
   * 최대 인원 수
   */
  @Column()
  maxNumberOfGamers: number;

  /**
   * 현재 참여 인원 수
   */
  @Column({ default: 0 })
  numberOfGamers: number;

  /**
   * 방 생성 일시
   */
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
