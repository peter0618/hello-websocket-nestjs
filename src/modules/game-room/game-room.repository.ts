import { EntityRepository, Repository } from 'typeorm';
import { GameRoom } from './entity/game-room.entity';

@EntityRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {}
