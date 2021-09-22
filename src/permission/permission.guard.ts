import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './permission.enum';
import { PERMISSION_KEY } from './permissions.decorator';
import { PermissionGroupRepository } from './permission.group.repository';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private reflector: Reflector,
    private readonly permissionGroupRepository: PermissionGroupRepository,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { user } = request;

    const requiredPermission = this.reflector.getAllAndOverride<Permission>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const userPermissionGroup = this.permissionGroupRepository.getById(
      user.permissionGroupId,
    );

    this.logger.debug(`user : ${JSON.stringify(user)}`);
    this.logger.debug(
      `userPermissionGroup : ${JSON.stringify(userPermissionGroup)}`,
    );
    this.logger.debug(
      `requiredPermission : ${JSON.stringify(requiredPermission)}`,
    );

    return userPermissionGroup.permissions.some(
      (permission) => permission === requiredPermission,
    );
  }
}
