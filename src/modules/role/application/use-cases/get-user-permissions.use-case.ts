// Get all user permissions through their roles

import { Injectable, Inject } from '@nestjs/common';
import {
  type IRoleRepository,
  IRoleRepositoryToken,
} from '../../domain/repositories/role.repository.interface';

@Injectable()
export class GetUserPermissionsUseCase {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepo: IRoleRepository,
  ) {}

  /**
   * User permissions = Sum of permissions from all user roles.
   */
  async execute(userId: string): Promise<string[]> {
    const roleIds = await this.roleRepo.getUserRoleIds(userId);

    let codes: string[] = [];

    for (const roleId of roleIds) {
      const permissions = await this.roleRepo.getRolePermissions(roleId);

      codes.push(...permissions.map((p) => p.code.toString()));
    }

    // unique
    return [...new Set(codes)];
  }
}
