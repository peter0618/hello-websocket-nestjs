import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Slack from 'slack-node';
import { SlackWebhookResponse } from './interfaces/slack-notification.interfaces';

@Injectable()
export class SlackNotificationService {
  private readonly webhookUri;

  constructor(private readonly configService: ConfigService) {
    this.webhookUri = configService.get<string>('WEBHOOK_URI');
  }

  /**
   * 슬랙 메시지를 전송합니다.
   * @param username
   * @param message
   * @param channel
   * @param iconEmoji
   */
  sendMessage(username: string, message: string, channel: string, iconEmoji: string): Promise<SlackWebhookResponse> {
    const slack = new Slack();
    slack.setWebhook(this.webhookUri);
    console.log(this.webhookUri);

    return new Promise((resolve, reject) => {
      slack.webhook(
        {
          username,
          text: message,
          channel,
          icon_emoji: iconEmoji == null ? ':white_check_mark:' : iconEmoji,
        },
        (err, response) => {
          if (err !== null) reject(err);
          else resolve(response);
        },
      );
    });
  }
}
