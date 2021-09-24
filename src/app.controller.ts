import { Controller, Get, HttpCode, Redirect, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Redirect('/chatroom', 301)
  @Render('index')
  root() {
    // TODO : change to login page
    const chatServerIP = this.configService.get<string>('CHAT_SERVER_IP');
    return { chatServerIP };
  }

  @Get('/chatroom')
  @Render('chatroom')
  chatroom() {
    const chatServerIP = this.configService.get<string>('CHAT_SERVER_IP');
    return { chatServerIP };
  }

  @Get('/api/healthcheck')
  @HttpCode(200)
  healthz() {
    return {
      status: 'success',
      message: `I'm healthy`,
    };
  }
}
