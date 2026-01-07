import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(id: string) {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundException();

    // org.softDelete();
    // await this.repo.save(org);
  }
}
