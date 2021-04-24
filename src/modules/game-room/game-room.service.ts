import { Injectable } from '@nestjs/common';
import { CreateGameRoomReqDto } from './dto/gaem-room.request.dto';
import { GameRoomRepository } from './game-room.repository';
import { User } from '../user/entity/user.entity';

@Injectable()
export class GameRoomService {
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
}
