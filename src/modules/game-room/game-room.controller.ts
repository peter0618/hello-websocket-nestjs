import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { CreateGameRoomReqDto } from './dto/gaem-room.request.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { User } from '../user/entity/user.entity';

@UseGuards(AuthGuard)
@Controller('api/game-room')
export class GameRoomController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly gameRoomService: GameRoomService) {}

  /**
   * 채팅방을 생성합니다.
   * @param user
   * @param dto
   */
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateGameRoomReqDto) {
    this.logger.debug(`create(user: ${JSON.stringify(user)}, dto: ${JSON.stringify(dto)})`);
    return this.gameRoomService.create(user, dto);
  }

  /**
   * 모든 채팅방 목록을 조회합니다.
   * TODO: 페이징 처리가 필요합니다.
   * @param user
   */
  @Get()
  findAll(@CurrentUser() user: User) {
    this.logger.debug(`findAll(user: ${JSON.stringify(user)})`);
    return this.gameRoomService.findAll();
  }

  /**
   * 특정 채팅방 정보를 조회합니다.
   * @param user
   * @param id
   */
  @Get(':id')
  findById(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    this.logger.debug(`findById(user: ${JSON.stringify(user)}, id: ${id})`);
    return this.gameRoomService.findById(id);
  }
}
