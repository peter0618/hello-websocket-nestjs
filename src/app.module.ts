import { Logger, Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GameRoomModule } from './modules/game-room/game-room.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [EventsModule, ConfigurationModule, UserModule, AuthModule, DatabaseModule, GameRoomModule],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
