import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class UpdateOrganizationSettingsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(orgId: string, settings: Record<string, any>) {
    const org = await this.repo.findById(orgId);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    org.updateSettings(settings);
    await this.repo.update(org);
  }
}
