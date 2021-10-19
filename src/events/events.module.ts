import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from '../modules/game-room/game-room.module';

@Module({
  imports: [GameRoomModule],
  providers: [EventGateway],
})
export class EventsModule {}
