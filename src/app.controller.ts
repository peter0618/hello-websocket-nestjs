import { Controller, Get, HttpCode, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Render('index')
  main() {
    return null;
  }

  @Get('/login')
  @Render('login')
  login() {
    return null;
  }

  @Get('/signup')
  @Render('signup')
  signup() {
    return null;
  }

  @Get('/waiting-room')
  @Render('waiting-room')
  waitingRoom() {
    return null;
  }

  @Get('/game-room')
  @Render('game-room')
  gameRoom() {
    return null;
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
