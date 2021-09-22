import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionGroupRepository } from '../../permission/permission.group.repository';

@Global()
@Module({
  providers: [UserService, PermissionGroupRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
