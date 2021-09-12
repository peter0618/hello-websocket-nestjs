import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [EventsModule, ConfigurationModule],
  controllers: [AppController],
})
export class AppModule {}
