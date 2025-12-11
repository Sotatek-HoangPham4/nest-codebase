import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { PermissionResponseDto } from '../../presentation/dtos/permission.response.dto';
import { Permission } from '../../domain/entities/permission.entity';

export interface GetPermissionsInput {
  group?: string;
  q?: string;
  skip?: number;
  take?: number;
}

export interface GetPermissionsOutput {
  items: Permission[];
  total: number;
}

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  /** Fetch permissions with optional filter and pagination */
  async execute(input?: GetPermissionsInput): Promise<GetPermissionsOutput> {
    return await this.permissionRepo.findAll(
      { group: input?.group, q: input?.q },
      { skip: input?.skip!, take: input?.take! },
    );
  }
}
