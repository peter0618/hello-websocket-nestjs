import { Module } from '@nestjs/common';
import { GameRoomController } from './game-room.controller';
import { GameRoomService } from './game-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoomRepository } from './game-room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameRoomRepository])],
  controllers: [GameRoomController],
  providers: [GameRoomService],
  exports: [GameRoomService],
})
export class GameRoomModule {}
