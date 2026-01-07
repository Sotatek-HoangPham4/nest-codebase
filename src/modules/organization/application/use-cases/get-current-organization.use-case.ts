import { Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class GetCurrentOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(currentOrgId: string) {
    return this.repo.findById(currentOrgId);
  }
}
