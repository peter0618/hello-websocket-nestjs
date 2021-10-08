import { Controller, Get, HttpCode, Logger, Render, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { CurrentUser } from './common/decorators/current.user.decorator';
import { User } from './modules/user/entity/user.entity';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(this.constructor.name);
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
    const chatServerIP = this.configService.get<string>('CHAT_SERVER_IP');
    return { chatServerIP };
  }

  @Get('/chatroom')
  @Render('chatroom')
  chatroom() {
    const chatServerIP = this.configService.get<string>('CHAT_SERVER_IP');
    return { chatServerIP };
  }

  @UseGuards(AuthGuard)
  @Get('/api/me')
  me(@CurrentUser() user: User) {
    this.logger.debug(`me(user: ${JSON.stringify(user)})`);
    return user;
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
