// Repository interface for Permission - lives in domain to follow DIP.
// Implementation should be provided in infrastructure.
import { Permission } from '../entities/permission.entity';

export const IPermissionRepositoryToken = 'IPermissionRepository';

export interface IPermissionRepository {
  findById(id: string): Promise<Permission | null>;
  findByCode(code: string): Promise<Permission | null>;
  findAll(
    filter?: { group?: string; q?: string },
    pagination?: { skip: number; take: number },
  ): Promise<{ items: Permission[]; total: number }>;
  create(permission: Permission): Promise<Permission>;
  createMany(permissions: Permission[]): Promise<Permission[]>;
  deleteById(id: string): Promise<void>;
  // Add update if your domain requires it
  update(permission: Permission): Promise<Permission>;
}
