import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  type IRoleRepository,
  IRoleRepositoryToken,
} from '../../domain/repositories/role.repository.interface';

import { AssignPermissionDto } from '../dtos/assign-permission.dto';
import {
  IPermissionRepositoryToken,
  type IPermissionRepository,
} from '@/modules/permission/domain/repositories/permission.repository.interface';

@Injectable()
export class AssignPermissionUseCase {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepo: IRoleRepository,

    @Inject(IPermissionRepositoryToken)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  /**
   * Assign a permission to a role.
   * This checks if both role + permission exist.
   */
  async execute(dto: AssignPermissionDto): Promise<void> {
    const role = await this.roleRepo.findById(dto.roleId);
    if (!role) throw new NotFoundException('Role not found');

    const permission = await this.permissionRepo.findById(dto.permissionId);
    if (!permission) throw new NotFoundException('Permission not found');

    const currentPermissions = await this.roleRepo.getRolePermissionIds(
      dto.roleId,
    );
    if (currentPermissions.includes(dto.permissionId)) return;

    const res = await this.roleRepo.assignPermission(
      dto.roleId,
      dto.permissionId,
    );

    console.log(res);
    return res;
  }
}
