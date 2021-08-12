import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  users: User[];

  constructor() {
    this.initUsers();
  }

  /**
   * initialize test users
   * @private
   */
  private initUsers() {
    this.users = [
      {
        id: 0,
        name: 'Peter',
        loginId: 'admin',
        password: '$2b$10$wEUG0pu1QdqMErquCXx3XOVWyHDRYuk0wZBvmcRivFr9d/WiOTdPO', // 12345678
        permissionGroupId: 1,
      },
      {
        id: 1,
        name: 'Peter',
        loginId: 'peter0618',
        password: '$2b$10$F4M6hHaSZsKRTAtJUt.pAuHfac4R5VVb6.QTM/rgWk2TjDcCH5w6C', // 1234qwer
        permissionGroupId: 1,
      },
      {
        id: 2,
        name: 'Grace',
        loginId: 'grace8701',
        password: '$2b$10$wEUG0pu1QdqMErquCXx3XOVWyHDRYuk0wZBvmcRivFr9d/WiOTdPO', // 12345678
        permissionGroupId: 1,
      },
      {
        id: 3,
        name: 'Eunsung',
        loginId: 'eunsung0623',
        password: '$2b$10$i3EeI/eIu7eONqcZvIA4xeJi2oSoE0valxWlILlD.44E9GyYA7a52', // 0987qwer
        permissionGroupId: 2,
      },
    ];
  }

  getAll() {
    return this.users;
  }

  async getByLoginId(loginId: string): Promise<User> {
    return this.users.filter(user => user.loginId === loginId)[0];
  }

  async getById(userId: number) {
    return this.users.filter(user => user.id === userId)[0];
  }
}
