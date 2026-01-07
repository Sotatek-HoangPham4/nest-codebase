import { Inject, Injectable } from '@nestjs/common';
import {
  IRoleRepositoryToken,
  type IRoleRepository,
} from '../../domain/repositories/role.repository.interface';

@Injectable()
export class GetPublicRolesUseCase {
  constructor(
    @Inject(IRoleRepositoryToken) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute() {
    // Option A (khuyên dùng): role có flag isAssignable = true
    return this.roleRepo.findPublicAssignableRoles();
  }
}
