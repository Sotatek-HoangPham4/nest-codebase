import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';
import { AddMemberDto } from '../dtos/add-member.dto';
import { OrgRole } from '../../domain/value-objects/org-role.vo';

@Injectable()
export class AddOrganizationMemberUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly repo: OrganizationMemberRepository,
  ) {}

  async execute(orgId: string, dto: AddMemberDto) {
    const alreadyMember = await this.repo.exists(orgId, dto.userId);
    if (alreadyMember) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    await this.repo.addMember({
      organizationId: orgId,
      userId: dto.userId,
      roleId: dto.roleId!,
    });

    return { organizationId: orgId, userId: dto.userId, roleId: dto.roleId };
  }
}
