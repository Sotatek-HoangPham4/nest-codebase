import { Inject, Injectable } from '@nestjs/common';

import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';
import { OrgRole } from '../../domain/value-objects/org-role.vo';

@Injectable()
export class ChangeMemberRoleUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly repo: OrganizationMemberRepository,
  ) {}

  async execute(orgId: string, userId: string, roleId: string) {
    await this.repo.changeRole(orgId, userId, roleId);
  }
}
