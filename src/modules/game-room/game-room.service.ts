import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGameRoomReqDto } from './dto/gaem-room.request.dto';
import { GameRoomRepository } from './game-room.repository';
import { User } from '../user/entity/user.entity';
import { Connection, getConnection, QueryRunner } from 'typeorm';

@Injectable()
export class GameRoomService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly gameRoomRepository: GameRoomRepository) {}
  create(user: User, dto: CreateGameRoomReqDto) {
    return this.gameRoomRepository.save({ ...dto, user });
  }

  findAll() {
    return this.gameRoomRepository
      .createQueryBuilder('gameRoom')
      .innerJoin('gameRoom.user', 'user')
      .select(['gameRoom', 'user.nickName'])
      .getMany();
  }

  /**
   * 특정 채팅방 정보를 조회합니다.
   * @param id
   */
  async findById(id: number) {
    const gameRoom = await this.gameRoomRepository
      .createQueryBuilder('gameRoom')
      .innerJoin('gameRoom.user', 'user')
      .select(['gameRoom', 'user.nickName', 'user.id'])
      .where(`gameRoom.id = ${id}`)
      .getOne();

    return gameRoom ? gameRoom : null;
  }

  /**
   * 특정 채팅방의 참여 인원수를 늘립니다.
   *
   * 1) 참여 인원수에 lock 을 걸고 늘릴수 있는 지 확인.
   * 2-1) 늘릴 수 있으면 늘림.
   * 2-2) 늘릴 수 없으면 늘릴 수 없다고 return.
   *
   * @param id
   */
  async join(id: number) {
    const connection: Connection = getConnection();

    const runner: QueryRunner = connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      const [{ numberOfGamers, maxNumberOfGamers }] = await runner.query(
        `select "numberOfGamers"
                     , "maxNumberOfGamers" 
                 from "game_room" 
                where id = ${id} for update`,
      );
      if (numberOfGamers >= maxNumberOfGamers) {
        await runner.commitTransaction();
        this.logger.debug(`최대 인원수 도달!`);
        return {
          hasJoined: false,
        };
      }
      this.logger.debug(`참여 인원수를 올립니다!`);
      await runner.query(
        `update "game_room"
                  set "numberOfGamers" = "numberOfGamers" + 1
                where id = ${id}`,
      );

      await runner.commitTransaction();
      return {
        hasJoined: true,
      };
    } catch (e) {
      await runner.rollbackTransaction();
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await runner.release();
    }
  }
}
