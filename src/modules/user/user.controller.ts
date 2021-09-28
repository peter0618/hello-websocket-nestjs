import { Controller, Delete, Get, Logger, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { User } from './entity/user.entity';
import { RequiredPermission } from '../../permission/permissions.decorator';
import { Permission } from '../../permission/permission.enum';
import { PermissionGuard } from '../../permission/permission.guard';

@UseGuards(AuthGuard, PermissionGuard)
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  @RequiredPermission(Permission.READ_USER)
  getAll(@CurrentUser() user?: User) {
    this.logger.debug(`user: ${JSON.stringify(user)}`);
    return this.userService.getAll();
  }

  @Post()
  @RequiredPermission(Permission.CREATE_USER)
  create(@CurrentUser() user?: User) {
    this.logger.debug(`create(user : ${JSON.stringify(user)})`);
    return 'user is created';
  }

  @Put()
  @RequiredPermission(Permission.UPDATE_USER)
  update() {
    return 'user is updated';
  }

  @Delete()
  @RequiredPermission(Permission.DELETE_USER)
  delete() {
    return 'user is deleted';
  }
}
