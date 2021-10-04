import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { CreateGameRoomReqDto } from './dto/gaem-room.request.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { User } from '../user/entity/user.entity';

@Controller('api/game-room')
export class GameRoomController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly gameRoomService: GameRoomService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateGameRoomReqDto) {
    this.logger.debug(`create(user: ${JSON.stringify(user)}, dto: ${JSON.stringify(dto)})`);
    return this.gameRoomService.create(user, dto);
  }
}
