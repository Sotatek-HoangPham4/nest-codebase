import { Permission } from '@/modules/permission/domain/entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';

export const IRoleRepositoryToken = 'IRoleRepository';

export interface IRoleRepository {
  save(role: RoleEntity): Promise<void>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;

  assignPermission(roleId: string, permissionId: string): Promise<void>;
  removePermission(roleId: string, permissionId: string): Promise<void>;
  getRolePermissionIds(roleId: string): Promise<string[]>;
  getRolePermissions(roleId: string): Promise<Permission[]>;

  assignRoleToUser(roleId: string, userId: string): Promise<void>;
  getUserRoleIds(userId: string): Promise<string[]>;
  getUserRoles(userId: string): Promise<{ id: string; name: string }[]>;
}
