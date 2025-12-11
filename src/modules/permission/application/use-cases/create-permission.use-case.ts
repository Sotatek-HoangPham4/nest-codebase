// UseCase to create a permission. Uses domain VO and repository interface.
// This class should be injected with an implementation of PermissionRepository.

import { Injectable, Inject } from '@nestjs/common';
import { Permission } from '../../domain/entities/permission.entity';
import { PermissionCode } from '../../domain/value-objects/permission-code.vo';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { v4 as uuidv4 } from 'uuid';

import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  // creates permission if not exists
  async execute(input: CreatePermissionDto): Promise<Permission> {
    const codeVo = PermissionCode.create(input.code);

    // check existing
    const existing = await this.permissionRepo.findByCode(codeVo.toString());
    if (existing) {
      // For idempotency we can return existing or throw. Here we return existing.
      return existing;
    }

    const permission = new Permission({
      id: input.id ?? uuidv4(),
      code: codeVo,
      description: input.description,
      group: input.group ?? codeVo.toString().split('.')[0],
    });

    return this.permissionRepo.create(permission);
  }
}
