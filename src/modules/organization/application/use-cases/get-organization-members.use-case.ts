import { Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';

import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import {
  type IRoleRepository,
  IRoleRepositoryToken,
} from '@/modules/role/domain/repositories/role.repository.interface';
import { type IUserRepository } from '@/modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class GetOrganizationMembersUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly memberRepo: OrganizationMemberRepository,

    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject(IRoleRepositoryToken)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(orgId: string) {
    const members = await this.memberRepo.findMembers(orgId);

    return Promise.all(
      members.map(async (m) => {
        const user = await this.userRepo.findById(m.userId);
        const role = await this.roleRepo.findById(m.roleId);

        return {
          ...m.toPrimitives(),
          user: user?.toPrimitives(),
          role: role?.toPrimitives(),
        };
      }),
    );
  }
}
