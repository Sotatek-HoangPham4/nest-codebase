import { Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';

@Injectable()
export class GetMyOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly memberRepo: OrganizationMemberRepository,
  ) {}

  async execute(userId: string) {
    return this.memberRepo.findOrganizationsByUser(userId);
  }
}
