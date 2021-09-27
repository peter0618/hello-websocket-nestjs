import { Injectable } from '@nestjs/common';
import { PermissionGroup } from './permission.group.entity';
import { Permission } from './permission.enum';

@Injectable()
export class PermissionGroupRepository {
  permissionGroups: PermissionGroup[];

  constructor() {
    this.initPermissionGroups();
  }

  private initPermissionGroups() {
    this.permissionGroups = [
      {
        id: 1,
        name: 'ADMIN',
        permissions: [
          Permission.CREATE_USER,
          Permission.READ_USER,
          Permission.UPDATE_USER,
          Permission.DELETE_USER,
        ],
      },
      { id: 2, name: 'CUSTOMER', permissions: [Permission.READ_USER] },
    ];
  }

  getById(id: number) {
    return this.permissionGroups.filter(
      (permissionGroup) => permissionGroup.id === id,
    )[0];
  }
}
