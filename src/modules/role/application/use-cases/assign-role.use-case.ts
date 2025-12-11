// Assign role → user

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  type IRoleRepository,
  IRoleRepositoryToken,
} from '../../domain/repositories/role.repository.interface';
import { AssignRoleDto } from '../dtos/assign-role.dto';

@Injectable()
export class AssignRoleUseCase {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepo: IRoleRepository,
  ) {}

  /**
   * Assign a role to a user.
   */
  async execute(dto: AssignRoleDto): Promise<void> {
    const role = await this.roleRepo.findById(dto.roleId);
    if (!role) throw new NotFoundException('Role not found');

    const existingRoles = await this.roleRepo.getUserRoleIds(dto.userId);
    if (existingRoles.includes(dto.roleId)) return;

    await this.roleRepo.assignRoleToUser(dto.roleId, dto.userId);
  }
}
