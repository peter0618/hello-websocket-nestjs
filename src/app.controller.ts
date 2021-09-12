import { Controller, Get, HttpCode, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Render('index')
  root() {
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
