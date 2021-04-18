import { Global, Module } from '@nestjs/common';
import { SlackNotificationService } from './slack-notification.service';

@Global()
@Module({
  providers: [SlackNotificationService],
  exports: [SlackNotificationService],
})
export class SlackNotificationModule {}
