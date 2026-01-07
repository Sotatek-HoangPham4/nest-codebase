import { Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';

@Injectable()
export class RemoveOrganizationMemberUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly repo: OrganizationMemberRepository,
  ) {}

  async execute(orgId: string, userId: string) {
    await this.repo.removeMember(orgId, userId);
  }
}
