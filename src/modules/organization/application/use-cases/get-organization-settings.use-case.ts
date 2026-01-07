import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class GetOrganizationSettingsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(orgId: string) {
    const org = await this.repo.findById(orgId);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org.settings;
  }
}
