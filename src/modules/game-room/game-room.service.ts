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

  /**
   * 채팅방 참여자의 퇴장 이벤트에 대한 비즈니스 로직을 처리합니다.
   *  1) 기본적으로는 참여인원수를 1 감소시킵니다.
   *  2) 마지막 남은 한명이 퇴장하는 경우 방을 제거합니다.
   * @param id
   */
  async handleLeavingRoom(id: number) {
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

      // 마지막 남은 인원이 퇴장하는 경우 방을 제거합니다.
      if (numberOfGamers === 1) {
        this.logger.debug(`마지막으로 남은 인원이 퇴장하여 해당 방(id=${id})을 제거합니다`);
        await runner.query(`delete from game_room where id = ${id}`);
        await runner.commitTransaction();
        return;
      }

      this.logger.debug(`참여 인원수를 내립니다! (총 인원수 : ${numberOfGamers - 1}/${maxNumberOfGamers})`);
      await runner.query(
        `update "game_room"
                  set "numberOfGamers" = "numberOfGamers" - 1
                where id = ${id}`,
      );
      await runner.commitTransaction();
      return;
    } catch (e) {
      await runner.rollbackTransaction();
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await runner.release();
    }
  }
}
