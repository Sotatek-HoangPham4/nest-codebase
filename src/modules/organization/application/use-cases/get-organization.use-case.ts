import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';
import { type IUserRepository } from '@/modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: OrganizationRepository,

    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string) {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundException('Organization not found');

    const owner = await this.userRepo.findById(org.ownerId);
    if (!owner) throw new NotFoundException('Owner not found');

    const props = org.getProps();
    return {
      ...props,
      created_at:
        props.created_at instanceof Date
          ? props.created_at.toISOString()
          : String(props.created_at),
      updated_at:
        props.updated_at instanceof Date
          ? props.updated_at.toISOString()
          : String(props.updated_at),
      owner: {
        id: owner.id,
        email: owner.email.getValue(),
        fullname: owner.fullname,
        avatar_url: owner.avatar_url ?? null,
      },
    };
  }
}
