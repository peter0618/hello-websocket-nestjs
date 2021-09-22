import { Permission } from './permission.enum';

/**
 * 사용자 권한 그룹 Entity
 */
export class PermissionGroup {
  /**
   * 유일식별자
   */
  id: number;

  /**
   * 권한 그룹명
   */
  name: string;

  /**
   * 권한 목록
   */
  permissions: Permission[];
}
