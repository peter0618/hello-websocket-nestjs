import { Logger, Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GameRoomModule } from './modules/game-room/game-room.module';

@Module({
  imports: [EventsModule, ConfigurationModule, UserModule, AuthModule, DatabaseModule, GameRoomModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
