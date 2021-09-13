import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll(@CurrentUser() user?: User) {
    this.logger.debug(`user: ${JSON.stringify(user)}`);
    return this.userService.getAll();
  }
}
