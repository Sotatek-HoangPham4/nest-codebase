import { Injectable, Inject } from '@nestjs/common';
import { IRoleRepositoryToken } from '../../domain/repositories/role.repository.interface';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';

@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @Inject(IRoleRepositoryToken) private readonly repo: IRoleRepository,
  ) {}

  async execute(userId: string) {
    const roles = await this.repo.getUserRoles(userId);
    return roles;
  }
}
