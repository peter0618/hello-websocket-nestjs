import { SetMetadata } from '@nestjs/common';
import { Permission } from './permission.enum';

export const PERMISSION_KEY = 'permission';
export const RequiredPermission = (permission: Permission) =>
  SetMetadata(PERMISSION_KEY, permission);
