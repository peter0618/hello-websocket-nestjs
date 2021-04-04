import { Logger, Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EventsModule, ConfigurationModule, UserModule, AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
