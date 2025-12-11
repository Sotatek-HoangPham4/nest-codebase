// Fetch single permission by id or code.
import { Injectable, Inject } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { Permission } from '../../domain/entities/permission.entity';

@Injectable()
export class GetPermissionDetailsUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async executeById(id: string): Promise<Permission | null> {
    return this.permissionRepo.findById(id);
  }

  async executeByCode(code: string): Promise<Permission | null> {
    return this.permissionRepo.findByCode(code);
  }
}
