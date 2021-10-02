import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionGroupRepository } from '../../permission/permission.group.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserMapper } from './mapper/user.mapper';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, PermissionGroupRepository, UserMapper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
